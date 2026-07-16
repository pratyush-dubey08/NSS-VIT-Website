import { Request, Response } from 'express';
import FormSchema from '../models/FormSchema';
import Registration from '../models/Registration';
import User from '../models/User';
import Activity from '../models/Activity';
import { AuthRequest } from '../middleware/authMiddleware';

// --- Form Schema Operations ---

export const getFormSchemaByActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    const schema = await FormSchema.findOne({ activityId });
    if (!schema) {
      return res.status(404).json({ message: 'Form schema not found for this activity' });
    }
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form schema' });
  }
};

export const saveFormSchema = async (req: Request, res: Response) => {
  try {
    const { activityId, fields, isActive } = req.body;
    
    // Upsert the schema
    const schema = await FormSchema.findOneAndUpdate(
      { activityId },
      { fields, isActive },
      { new: true, upsert: true }
    );
    
    res.status(200).json(schema);
  } catch (error) {
    res.status(500).json({ message: 'Error saving form schema' });
  }
};

// --- Registration Operations ---

export const submitRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const { activityId, responses } = req.body;
    const userId = req.user?.userId;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    // Verify schema exists and is active
    const schema = await FormSchema.findOne({ activityId });
    if (!schema || !schema.isActive) {
      return res.status(400).json({ message: 'Registration is not currently open for this activity' });
    }

    const registration = new Registration({
      activityId,
      userId,
      responses,
      status: 'PENDING'
    });

    await registration.save();
    res.status(201).json({ message: 'Registration submitted successfully', registration });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already registered for this activity' });
    }
    res.status(500).json({ message: 'Error submitting registration' });
  }
};

export const getRegistrationsByActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;
    
    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const activity = await Activity.findById(activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      
      const isManager = activity.eventManagers.some(m => m.toString() === userId);
      if (!isManager) return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ activityId }).populate('userId', 'name registrationNumber department email phoneNumber gender batch residenceType');
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching registrations' });
  }
};

export const updateRegistrationStatus = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'

    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const activity = await Activity.findById(registration.activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      const isManager = activity.eventManagers.some(m => m.toString() === userId);
      if (!isManager) return res.status(403).json({ message: 'Not authorized' });
    }

    registration.status = status;
    await registration.save();

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

export const markAttendance = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    const { attendanceStatus } = req.body; // 'PENDING', 'ATTENDED', 'BUNKED'

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.attendanceStatus === attendanceStatus) {
      return res.status(200).json(registration); // No change
    }

    // Auth check: If user is EVENT_MANAGER, they must be in the eventManagers list for this activity
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    const activity = await Activity.findById(registration.activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (userRole === 'EVENT_MANAGER' || userRole === 'VOLUNTEER') {
      const isManager = activity.eventManagers.some(m => m.toString() === userId);
      if (!isManager) {
        return res.status(403).json({ message: 'You are not authorized to mark attendance for this event' });
      }
    }

    const previousStatus = registration.attendanceStatus;
    registration.attendanceStatus = attendanceStatus;
    await registration.save();

    // Adjust User Hours and Bunks
    // activity is already fetched above
    if (activity) {
      const user = await User.findById(registration.userId);
      if (user) {
        // Reverse previous status effect
        if (previousStatus === 'ATTENDED') {
          user.accumulatedHours -= activity.hoursAllocated || 0;
        } else if (previousStatus === 'BUNKED') {
          user.bunks = Math.max(0, (user.bunks || 0) - 1);
        }

        // Apply new status effect
        if (attendanceStatus === 'ATTENDED') {
          user.accumulatedHours += activity.hoursAllocated || 0;
        } else if (attendanceStatus === 'BUNKED') {
          user.bunks = (user.bunks || 0) + 1;
        }

        await user.save();
      }
    }

    res.status(200).json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance' });
  }
};

export const batchMarkAttendance = async (req: Request, res: Response) => {
  try {
    const { updates } = req.body; // Array of { registrationId, attendanceStatus }
    
    if (!Array.isArray(updates)) {
      return res.status(400).json({ message: 'Updates must be an array' });
    }

    // Since updating attendance also affects User hours/bunks, we'll process sequentially
    // to avoid complex transaction/concurrency issues or reuse the markAttendance logic internally.
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.userId;

    let processedCount = 0;

    for (const update of updates) {
      const { registrationId, attendanceStatus } = update;
      const registration = await Registration.findById(registrationId);
      
      if (!registration || registration.attendanceStatus === attendanceStatus) continue;

      const activity = await Activity.findById(registration.activityId);
      if (!activity) continue;

      if (userRole === 'EVENT_MANAGER' || userRole === 'VOLUNTEER') {
        const isManager = activity.eventManagers.some(m => m.toString() === userId);
        if (!isManager) continue;
      }

      const previousStatus = registration.attendanceStatus;
      registration.attendanceStatus = attendanceStatus;
      await registration.save();

      const user = await User.findById(registration.userId);
      if (user) {
        if (previousStatus === 'ATTENDED') {
          user.accumulatedHours -= activity.hoursAllocated || 0;
        } else if (previousStatus === 'BUNKED') {
          user.bunks = Math.max(0, (user.bunks || 0) - 1);
        }

        if (attendanceStatus === 'ATTENDED') {
          user.accumulatedHours += activity.hoursAllocated || 0;
        } else if (attendanceStatus === 'BUNKED') {
          user.bunks = (user.bunks || 0) + 1;
        }
        await user.save();
      }
      processedCount++;
    }

    res.status(200).json({ message: 'Batch attendance updated successfully', processedCount });
  } catch (error) {
    console.error('Batch attendance error:', error);
    res.status(500).json({ message: 'Error updating batch attendance' });
  }
};

export const addManualRegistration = async (req: Request, res: Response) => {
  try {
    const { activityId, userIds } = req.body;
    
    if (!activityId || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'activityId and userIds array are required' });
    }

    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const activity = await Activity.findById(activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      const isManager = activity.eventManagers.some(m => m.toString() === userId);
      if (!isManager) return res.status(403).json({ message: 'Not authorized' });
    }

    const addedRegistrations = [];

    for (const uId of userIds) {
      // Check if already registered
      const existing = await Registration.findOne({ activityId, userId: uId });
      if (existing) continue;

      // Create a manual registration
      const registration = new Registration({
        activityId,
        userId: uId,
        responses: [],
        status: 'APPROVED' // manually added volunteers are approved by default
      });

      await registration.save();
      await registration.populate('userId', 'name registrationNumber department email phoneNumber gender batch residenceType');
      addedRegistrations.push(registration);
    }

    res.status(201).json({ message: 'Volunteers added successfully', registrations: addedRegistrations });
  } catch (error) {
    console.error('Manual registration error:', error);
    res.status(500).json({ message: 'Error adding volunteers manually' });
  }
};

export const deleteRegistration = async (req: Request, res: Response) => {
  try {
    const { registrationId } = req.params;
    
    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    const registration = await Registration.findById(registrationId);
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const activity = await Activity.findById(registration.activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      const isManager = activity.eventManagers.some(m => m.toString() === userId);
      if (!isManager) return res.status(403).json({ message: 'Not authorized' });
    }

    await Registration.findByIdAndDelete(registrationId);

    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ message: 'Error deleting registration' });
  }
};

export const getMyRegistrations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const registrations = await Registration.find({ userId })
      .populate('activityId', 'title date status isRegistrationOpen')
      .sort({ createdAt: -1 });
    
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


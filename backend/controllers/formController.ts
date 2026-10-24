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
    const activityId = req.params.activityId || req.body.activityId;
    const { fields, isActive } = req.body;

    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.userId || (req as any).user?.id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (userRole === 'EVENT_MANAGER' || userRole === 'VOLUNTEER') {
      const isManager = activity.eventManagers?.some(m => (m._id || m).toString() === userId?.toString());
      if (!isManager && userRole !== 'SUPER_ADMIN' && userRole !== 'PROGRAM_OFFICER') {
        return res.status(403).json({ message: 'You are not authorized to edit the form schema for this event' });
      }
    }
    
    // Upsert the schema
    const schema = await FormSchema.findOneAndUpdate(
      { activityId },
      { fields, isActive },
      { new: true, upsert: true }
    );

    // Keep Activity.formSchema in sync as well
    if (fields && Array.isArray(fields)) {
      activity.formSchema = fields;
      await activity.save();
    }
    
    res.status(200).json(schema);
  } catch (error) {
    console.error('Error saving form schema:', error);
    res.status(500).json({ message: 'Error saving form schema' });
  }
};

// --- Registration Operations ---

export const submitRegistration = async (req: Request, res: Response) => {
  try {
    const { activityId, responses, email: directEmail, fullName: directFullName, registrationNumber: directRegNo, phoneNumber: directPhone } = req.body;
    const authUser = (req as any).user;
    let userId = authUser?.userId || authUser?.id;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (!activity.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registrations are currently closed for this activity.' });
    }

    // Extract email from body, authUser, or responses
    let email = directEmail || authUser?.email || '';
    let fullName = directFullName || authUser?.name || '';
    let registrationNumber = directRegNo || authUser?.registrationNumber || '';
    let phoneNumber = directPhone || authUser?.phoneNumber || '';

    // Search responses if not directly provided
    if (Array.isArray(responses)) {
      for (const r of responses) {
        const val = typeof r.value === 'string' ? r.value.trim() : '';
        if (!email && val.toLowerCase().includes('@')) {
          email = val;
        }
        if (!registrationNumber && /^[0-9]{2}[A-Za-z]{3}[0-9]{4,5}$/i.test(val)) {
          registrationNumber = val.toUpperCase();
        }
      }
    }

    const normalizedEmail = (email || '').toLowerCase().trim();
    if (!normalizedEmail) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    // Strict VIT Bhopal email validation
    if (!normalizedEmail.endsWith('@vitbhopal.ac.in')) {
      return res.status(400).json({ 
        message: 'Only official VIT Bhopal email addresses ending in @vitbhopal.ac.in are allowed to register.' 
      });
    }

    // Check for duplicate registration for this activity
    const duplicateQuery: any = {
      activityId,
      $or: [
        { email: normalizedEmail }
      ]
    };
    if (userId) {
      duplicateQuery.$or.push({ userId });
    }

    const existingReg = await Registration.findOne(duplicateQuery);
    if (existingReg) {
      return res.status(400).json({ 
        message: 'This email address (' + normalizedEmail + ') has already registered for this event. Only one submission per student is allowed.' 
      });
    }

    // If userId not present, see if a user already exists with this email
    if (!userId) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        userId = existingUser._id;
        if (!fullName) fullName = existingUser.name;
        if (!registrationNumber) registrationNumber = existingUser.registrationNumber;
        if (!phoneNumber) phoneNumber = existingUser.phoneNumber;
      }
    }

    const registration = new Registration({
      activityId,
      userId: userId || undefined,
      fullName: fullName || 'VIT Student',
      email: normalizedEmail,
      registrationNumber: registrationNumber || '',
      phoneNumber: phoneNumber || '',
      responses: Array.isArray(responses) ? responses : [],
      status: 'APPROVED',
      attendanceStatus: 'PENDING'
    });

    await registration.save();

    const confirmationMessage = activity.confirmationMessage || 'Thank you for filling out the form! Our team will contact you shortly.';

    res.status(201).json({ 
      message: 'Registration submitted successfully', 
      registration,
      confirmationMessage
    });
  } catch (error: any) {
    console.error('Error submitting registration:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already registered for this activity with this email address.' });
    }
    res.status(500).json({ message: 'Error submitting registration' });
  }
};

export const getRegistrationsByActivity = async (req: Request, res: Response) => {
  try {
    const { activityId } = req.params;
    
    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.userId || (req as any).user?.id;
    
    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const activity = await Activity.findById(activityId);
      if (!activity) return res.status(404).json({ message: 'Activity not found' });
      
      const isManager = activity.eventManagers?.some(m => (m._id || m).toString() === userId);
      if (!isManager && userRole !== 'SUPER_ADMIN' && userRole !== 'PROGRAM_OFFICER') {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const registrations = await Registration.find({ activityId })
      .populate('userId', 'name registrationNumber department email phoneNumber gender batch residenceType')
      .sort({ createdAt: -1 });

    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
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
      const isManager = activity.eventManagers?.some(m => (m._id || m).toString() === userId?.toString());
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
      const isManager = activity.eventManagers.some(m => (m._id || m).toString() === userId);
      if (!isManager) return res.status(403).json({ message: 'Not authorized' });
    }

    // 1. Find all existing registrations in 1 fast query
    const existing = await Registration.find({
      activityId,
      userId: { $in: userIds }
    }).select('userId');
    
    const existingSet = new Set(existing.filter(r => r.userId != null).map(r => (r.userId as any).toString()));
    const newIds = userIds.filter(id => !existingSet.has(id.toString()));

    if (newIds.length === 0) {
      return res.status(200).json({ 
        message: 'All selected volunteers are already registered for this event.',
        registrations: [] 
      });
    }

    // 2. Prepare documents for single bulk insert
    const docs = newIds.map(uId => ({
      activityId,
      userId: uId,
      responses: [],
      status: 'APPROVED',
      attendanceStatus: 'PENDING'
    }));

    const inserted = await Registration.insertMany(docs, { ordered: false });
    
    // 3. Populate all inserted registrations in 1 query
    const populated = await Registration.find({
      _id: { $in: inserted.map(d => d._id) }
    }).populate('userId', 'name registrationNumber department email phoneNumber gender batch residenceType');

    res.status(201).json({ message: 'Volunteers added successfully', registrations: populated });
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
    const userId = (req as any).user.userId || (req as any).user.id;
    const registrations = await Registration.find({ userId })
      .populate('activityId', 'title date venue description bannerUrl hoursAllocated workingHours status isRegistrationOpen')
      .sort({ createdAt: -1 });
    
    // Filter out orphaned registrations where activity was deleted
    const validRegistrations = registrations.filter(r => r.activityId != null);
    res.json(validRegistrations);
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


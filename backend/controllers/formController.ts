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
    let schema = await FormSchema.findOne({ activityId });
    if (!schema) {
      const activity = await Activity.findById(activityId);
      if (activity) {
        return res.status(200).json({
          activityId: activity._id,
          fields: activity.formSchema || [],
          isActive: activity.isRegistrationOpen !== false,
          googleFormUrl: activity.googleFormUrl || '',
          registrationMode: activity.registrationMode || 'CUSTOM'
        });
      }
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
    const { fields, isActive, googleFormUrl, registrationMode } = req.body;

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

      if (activity.isFormLockedForManagers) {
        return res.status(403).json({ message: 'Form editing is currently locked by Admin for Event Managers.' });
      }
    }
    
    // Upsert the schema
    const updateData: any = {};
    if (fields !== undefined) updateData.fields = fields;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (googleFormUrl !== undefined) updateData.googleFormUrl = googleFormUrl;
    if (registrationMode !== undefined) updateData.registrationMode = registrationMode;

    const schema = await FormSchema.findOneAndUpdate(
      { activityId },
      updateData,
      { new: true, upsert: true }
    );

    // Keep Activity in sync as well
    if (fields && Array.isArray(fields)) {
      activity.formSchema = fields;
    }
    if (googleFormUrl !== undefined) {
      activity.googleFormUrl = googleFormUrl;
    }
    if (registrationMode !== undefined) {
      activity.registrationMode = registrationMode;
    }
    if (isActive !== undefined) {
      activity.isRegistrationOpen = isActive;
    } else {
      activity.isRegistrationOpen = true;
    }
    await activity.save();
    
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

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    if (!activity.isRegistrationOpen) {
      return res.status(400).json({ message: 'Registrations are currently closed for this activity.' });
    }

    // Extract email, name, regNo from responses or direct body
    let email = directEmail || '';
    let fullName = directFullName || '';
    let registrationNumber = directRegNo || '';
    let phoneNumber = directPhone || '';

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
        if (!phoneNumber && /^[0-9]{10}$/.test(val)) {
          phoneNumber = val;
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

    // Strict one submission per student email for this activity
    const existingReg = await Registration.findOne({
      activityId,
      registrationType: 'PARTICIPANT',
      email: normalizedEmail
    });
    if (existingReg) {
      return res.status(400).json({ 
        message: 'A response has already been recorded for ' + normalizedEmail + '. Only one submission per student is allowed.' 
      });
    }

    // Only link to an existing user if this specific email belongs to a registered user
    let participantUserId: any = undefined;
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      participantUserId = existingUser._id;
      if (!fullName) fullName = existingUser.name;
      if (!registrationNumber) registrationNumber = existingUser.registrationNumber;
      if (!phoneNumber) phoneNumber = existingUser.phoneNumber;
    }

    const registration = new Registration({
      activityId,
      userId: participantUserId || undefined,
      fullName: fullName || 'VIT Student',
      email: normalizedEmail,
      registrationNumber: registrationNumber || '',
      phoneNumber: phoneNumber || '',
      responses: Array.isArray(responses) ? responses : [],
      status: 'APPROVED',
      attendanceStatus: 'PENDING',
      registrationType: 'PARTICIPANT'
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
      return res.status(400).json({ message: 'A response has already been recorded for this email address.' });
    }
    res.status(500).json({ message: 'Error submitting registration. Please try again.' });
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
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Updates must be a non-empty array' });
    }

    const userRole = (req as any).user?.role;
    const userId = (req as any).user?.userId;

    // 1. Fetch all matching registrations in 1 query
    const regIds = updates.map(u => u.registrationId).filter(Boolean);
    const registrations = await Registration.find({ _id: { $in: regIds } });
    const regMap = new Map(registrations.map(r => [r._id.toString(), r]));

    // 2. Fetch all involved activities in 1 query
    const activityIds = [...new Set(registrations.map(r => r.activityId.toString()))];
    const activities = await Activity.find({ _id: { $in: activityIds } });
    const activityMap = new Map(activities.map(a => [a._id.toString(), a]));

    const regBulkOps: any[] = [];
    const userHourDeltas = new Map<string, number>();
    const userBunkDeltas = new Map<string, number>();
    let processedCount = 0;

    for (const update of updates) {
      const { registrationId, attendanceStatus } = update;
      const registration = regMap.get(registrationId);
      
      if (!registration || registration.attendanceStatus === attendanceStatus) continue;

      const activity = activityMap.get(registration.activityId.toString());
      if (!activity) continue;

      if (userRole === 'EVENT_MANAGER' || userRole === 'VOLUNTEER') {
        const isManager = activity.eventManagers.some((m: any) => m.toString() === userId);
        if (!isManager) continue;
      }

      const previousStatus = registration.attendanceStatus;
      const actHours = activity.hoursAllocated || 0;

      // Queue registration update
      regBulkOps.push({
        updateOne: {
          filter: { _id: registration._id },
          update: { $set: { attendanceStatus } }
        }
      });

      // Calculate deltas for user hours and bunks
      if (registration.userId) {
        const uId = registration.userId.toString();
        let hDelta = userHourDeltas.get(uId) || 0;
        let bDelta = userBunkDeltas.get(uId) || 0;

        if (previousStatus === 'ATTENDED') hDelta -= actHours;
        else if (previousStatus === 'BUNKED') bDelta -= 1;

        if (attendanceStatus === 'ATTENDED') hDelta += actHours;
        else if (attendanceStatus === 'BUNKED') bDelta += 1;

        userHourDeltas.set(uId, hDelta);
        userBunkDeltas.set(uId, bDelta);
      }
      processedCount++;
    }

    // Execute registration updates in 1 database round-trip
    if (regBulkOps.length > 0) {
      await Registration.bulkWrite(regBulkOps);
    }

    // Execute user updates in 1 database round-trip
    const userBulkOps: any[] = [];
    for (const [uId, hDelta] of userHourDeltas.entries()) {
      const bDelta = userBunkDeltas.get(uId) || 0;
      if (hDelta !== 0 || bDelta !== 0) {
        userBulkOps.push({
          updateOne: {
            filter: { _id: uId },
            update: {
              $inc: {
                accumulatedHours: hDelta,
                bunks: bDelta
              }
            }
          }
        });
      }
    }
    if (userBulkOps.length > 0) {
      await User.bulkWrite(userBulkOps);
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
      registrationType: 'VOLUNTEER',
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
      attendanceStatus: 'PENDING',
      registrationType: 'VOLUNTEER'
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


export const bulkDeleteRegistrations = async (req: Request, res: Response) => {
  try {
    const ids = req.body.registrationIds || req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No registration IDs provided' });
    }

    const userRole = (req as any).user.role;
    const userId = (req as any).user.userId;

    if (userRole === 'VOLUNTEER' || userRole === 'EVENT_MANAGER') {
      const sample = await Registration.findOne({ _id: { $in: ids } });
      if (sample) {
        const activity = await Activity.findById(sample.activityId);
        if (!activity) return res.status(404).json({ message: 'Activity not found' });
        const isManager = activity.eventManagers.some(m => m.toString() === userId);
        if (!isManager) return res.status(403).json({ message: 'Not authorized' });
      }
    }

    const result = await Registration.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} registrations deleted successfully`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error bulk deleting registrations:', error);
    res.status(500).json({ message: 'Error bulk deleting registrations' });
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
      .populate('activityId', 'title date venue description bannerUrl hoursAllocated workingHours status isRegistrationOpen googleFormUrl registrationMode')
      .sort({ createdAt: -1 });
    
    // Filter out orphaned registrations where activity was deleted
    const validRegistrations = registrations.filter(r => r.activityId != null);

    // Sort chronologically by activity event date: newest / most recent first to oldest last
    validRegistrations.sort((a: any, b: any) => {
      const dateA = a.activityId?.date ? new Date(a.activityId.date).getTime() : 0;
      const dateB = b.activityId?.date ? new Date(b.activityId.date).getTime() : 0;
      return dateB - dateA;
    });

    res.json(validRegistrations);
  } catch (error) {
    console.error('Error fetching my registrations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


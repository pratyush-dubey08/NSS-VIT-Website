import ChangeRequest from '../models/ChangeRequest';
import Registration from '../models/Registration';
import { Request, Response } from 'express';
import User, { Role } from '../models/User';
import bcrypt from 'bcryptjs';

// Get all volunteers
export const getVolunteers = async (req: Request, res: Response) => {
  try {
    const volunteers = await User.find({ role: { $ne: Role.SUPER_ADMIN } }).select('-password').sort({ name: 1 });
    res.status(200).json(volunteers);
  } catch (error) {
    console.error('Error fetching volunteers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get public list of volunteers (only basic info, no-cache so newly added volunteers appear instantly)
export const getPublicVolunteers = async (req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const volunteers = await User.find({ role: { $ne: Role.SUPER_ADMIN } })
      .select('name registrationNumber batch phoneNumber gender residenceType')
      .sort({ name: 1 });
    res.status(200).json(volunteers);
  } catch (error) {
    console.error('Error fetching public volunteers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get current volunteer / user's own profile
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Volunteer profile not found' });
    }
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a single volunteer
export const addVolunteer = async (req: Request, res: Response) => {
  try {
    const { name, registrationNumber, email, phoneNumber, batch, gender, residenceType } = req.body;
    
    const existing = await User.findOne({ registrationNumber });
    if (existing) {
      return res.status(400).json({ message: 'Volunteer with this registration number already exists' });
    }

    const volunteer = await User.create({
      name,
      registrationNumber: registrationNumber.toUpperCase(),
      email,
      phoneNumber,
      batch,
      gender,
      residenceType,
      role: Role.VOLUNTEER,
      accumulatedHours: 0,
      bunks: 0
    });

    res.status(201).json(volunteer);
  } catch (error) {
    console.error('Error adding volunteer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Bulk add volunteers
export const bulkAddVolunteers = async (req: Request, res: Response) => {
  try {
    const { volunteers } = req.body; // array of objects
    
    if (!Array.isArray(volunteers) || volunteers.length === 0) {
      return res.status(400).json({ message: 'Invalid data format' });
    }

    // Process array with clean field sanitation
    const toInsert = volunteers
      .filter((v: any) => v && (v.name || v.registrationNumber))
      .map((v: any) => {
        const item: any = {
          name: (v.name || 'Volunteer').trim(),
          registrationNumber: (v.registrationNumber || '').trim().toUpperCase(),
          role: Role.VOLUNTEER,
          accumulatedHours: 0,
          bunks: 0
        };

        if (v.email && String(v.email).trim()) {
          item.email = String(v.email).trim().toLowerCase();
        }

        if (v.phoneNumber && String(v.phoneNumber).trim()) {
          item.phoneNumber = String(v.phoneNumber).trim();
        }

        if (v.batch && String(v.batch).trim()) {
          item.batch = String(v.batch).trim();
        }

        const validGenders = ['Male', 'Female', 'Other'];
        if (v.gender && validGenders.includes(v.gender)) {
          item.gender = v.gender;
        }

        const validResidence = ['Hosteller', 'Day Scholar'];
        if (v.residenceType && validResidence.includes(v.residenceType)) {
          item.residenceType = v.residenceType;
        }

        return item;
      });

    if (toInsert.length === 0) {
      return res.status(400).json({ message: 'No valid volunteer records to insert.' });
    }

    const result = await User.insertMany(toInsert, { ordered: false });

    res.status(201).json({ 
      message: `Successfully added ${result.length} volunteer(s).`,
      count: result.length
    });
  } catch (error: any) {
    console.error('Error bulk adding volunteers:', error);
    // When ordered: false, duplicate keys throw error but non-duplicates are inserted
    if (error?.code === 11000 || error?.writeErrors?.length > 0) {
      const insertedCount = error?.insertedDocs?.length || 0;
      return res.status(200).json({ 
        message: 'Volunteers imported. Existing duplicates (Reg No / Email) were skipped automatically.',
        insertedCount,
        partial: true 
      });
    }
    res.status(500).json({ message: error.message || 'Server Error while importing volunteers' });
  }
};

// Update volunteer (bunks, certificates, etc.)
export const updateVolunteer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bunks, accumulatedHours, certificates, position, name, email, batch, gender, residenceType, phoneNumber, registrationNumber, newCertificate } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    if (bunks !== undefined) user.bunks = bunks;
    if (accumulatedHours !== undefined) user.accumulatedHours = accumulatedHours;
    if (certificates !== undefined) user.certificates = certificates;
    if (newCertificate) {
      if (!user.certificates) user.certificates = [];
      user.certificates.push(newCertificate);
    }
    if (position !== undefined) user.position = position;
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (batch !== undefined) user.batch = batch;
    if (gender !== undefined) user.gender = gender;
    if (residenceType !== undefined) user.residenceType = residenceType;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (registrationNumber !== undefined) user.registrationNumber = registrationNumber.toUpperCase();

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating volunteer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete volunteer

// Bulk delete volunteers
export const bulkDeleteVolunteers = async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No volunteer IDs provided' });
    }
    const result = await User.deleteMany({ _id: { $in: ids }, role: { $ne: Role.SUPER_ADMIN } });
    res.status(200).json({ message: `${result.deletedCount} volunteers removed`, deletedCount: result.deletedCount });
  } catch (error) {
    console.error('Error bulk deleting volunteers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteVolunteer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    // Cascade delete all registrations across all activities for this volunteer
    await Registration.deleteMany({ userId: id });
    res.status(200).json({ message: 'Volunteer removed and deleted from all activities' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update my own profile (Volunteer/User)
export const updateMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { name, email, batch, gender, residenceType, phoneNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (batch !== undefined) user.batch = batch;
    if (gender !== undefined) user.gender = gender;
    if (residenceType !== undefined) user.residenceType = residenceType;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


// Get full report card and activity attendance for a single volunteer
export const getVolunteerReport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const volunteer = await User.findById(id).select('-password');
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Find all registrations for this volunteer across all activities
    const registrations = await Registration.find({ userId: id })
      .populate('activityId', 'title date category hours venue bannerUrl')
      .sort({ createdAt: -1 });

    const totalEvents = registrations.length;
    const attendedEvents = registrations.filter(r => r.attendanceStatus === 'ATTENDED').length;
    const bunkedEvents = registrations.filter(r => r.attendanceStatus === 'BUNKED').length;
    const pendingEvents = registrations.filter(r => r.attendanceStatus === 'PENDING').length;
    
    const calculatedHours = registrations
      .filter(r => r.attendanceStatus === 'ATTENDED')
      .reduce((sum, r: any) => sum + (Number(r.activityId?.hours) || 0), 0);

    const totalHours = calculatedHours > 0 ? calculatedHours : (volunteer.accumulatedHours || 0);

    res.status(200).json({
      volunteer,
      stats: {
        totalEvents,
        attendedEvents,
        bunkedEvents,
        pendingEvents,
        attendanceRate: totalEvents > 0 ? Math.round((attendedEvents / totalEvents) * 100) : 100,
        totalHours
      },
      activities: registrations.map((r: any) => ({
        id: r._id,
        activityId: r.activityId?._id,
        title: r.activityId?.title || 'Community Service Activity',
        date: r.activityId?.date ? new Date(r.activityId.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        category: r.activityId?.category || 'General',
        venue: r.activityId?.venue || 'Campus',
        hours: r.activityId?.hours || 0,
        registrationStatus: r.status,
        attendanceStatus: r.attendanceStatus, // 'ATTENDED' | 'BUNKED' | 'PENDING'
        registeredAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching volunteer report:', error);
    res.status(500).json({ message: 'Server error fetching volunteer report' });
  }
};

// Volunteer submits a profile correction request
export const createChangeRequest = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { field, currentValue, requestedValue, reason } = req.body;

    if (!field || !requestedValue) {
      return res.status(400).json({ message: 'Field and requested correct value are required' });
    }

    const newRequest = await ChangeRequest.create({
      user: user._id,
      volunteerName: user.name || 'Volunteer',
      registrationNumber: user.registrationNumber || '',
      email: user.email || '',
      field,
      currentValue: currentValue || '',
      requestedValue: String(requestedValue).trim(),
      reason: reason ? String(reason).trim() : '',
      status: 'Pending'
    });

    res.status(201).json({
      message: 'Correction request submitted successfully! NSS Admin will review and update it.',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creating change request:', error);
    res.status(500).json({ message: 'Failed to submit correction request' });
  }
};

// Volunteer gets their own change requests
export const getMyChangeRequests = async (req: any, res: any) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const requests = await ChangeRequest.find({ user: user._id }).sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching my change requests:', error);
    res.status(500).json({ message: 'Failed to fetch change requests' });
  }
};

// Admin gets all change requests
export const getAllChangeRequests = async (req: any, res: any) => {
  try {
    const requests = await ChangeRequest.find()
      .populate('user', 'name registrationNumber email phoneNumber batch gender residenceType')
      .sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching all change requests:', error);
    res.status(500).json({ message: 'Failed to fetch change requests' });
  }
};

// Admin updates change request status (e.g. 'Accepted' or 'Pending')
export const updateChangeRequestStatus = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await ChangeRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Change request not found' });
    }

    request.status = status || 'Accepted';
    request.reviewedAt = new Date();
    if (req.user) {
      request.reviewedBy = req.user._id;
    }

    await request.save();
    res.status(200).json({
      message: `Request marked as ${request.status}`,
      request
    });
  } catch (error) {
    console.error('Error updating change request status:', error);
    res.status(500).json({ message: 'Failed to update change request status' });
  }
};

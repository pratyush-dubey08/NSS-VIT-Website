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

    // Process array
    const toInsert = volunteers.map(v => ({
      ...v,
      registrationNumber: v.registrationNumber ? v.registrationNumber.toUpperCase() : '',
      gender: v.gender,
      residenceType: v.residenceType,
      role: Role.VOLUNTEER,
      accumulatedHours: 0,
      bunks: 0
    }));

    await User.insertMany(toInsert, { ordered: false });

    res.status(201).json({ message: 'Volunteers added successfully' });
  } catch (error) {
    console.error('Error bulk adding volunteers:', error);
    // Ignore duplicate key errors on insertMany
    res.status(500).json({ message: 'Server Error (Some duplicates may have been skipped)' });
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
export const deleteVolunteer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Volunteer removed' });
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

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { Role } from '../models/User';

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { name, registrationNumber, email, password, isAdminLogin } = req.body;

    let user;

    if (isAdminLogin) {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for admin login' });
      }

      // STRICT SECURITY ENFORCEMENT
      // Absolutely no other email is allowed to access the admin portal under any circumstances.
      if (email.toLowerCase() !== 'nss@vitbhopal.ac.in') {
        return res.status(403).json({ message: 'Critical Security Alert: Unauthorized email address.' });
      }

      user = await User.findOne({ email: 'nss@vitbhopal.ac.in' });
      if (!user) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password || '');
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
    } else {
      if (!name || !registrationNumber) {
        return res.status(400).json({ message: 'Name and Registration Number are required' });
      }

      const normalizedRegNo = registrationNumber.trim().toUpperCase();
      const normalizedName = name.trim();

      user = await User.findOne({ registrationNumber: normalizedRegNo });

      if (!user) {
        // Since we are seeding all volunteers, if they aren't in DB, they shouldn't be allowed to login.
        return res.status(404).json({ message: 'Volunteer not found. Please contact the administrator.' });
      }

      if (user.name.toLowerCase() !== normalizedName.toLowerCase()) {
        return res.status(401).json({ message: 'Name does not match the registration number' });
      }
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        registrationNumber: user.registrationNumber,
        email: user.email,
        accumulatedHours: user.accumulatedHours || 0,
        bunks: user.bunks || 0,
        certificates: user.certificates || []
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
    // Assuming req.user is set by authMiddleware
    const userId = (req as any).user.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);
    if (!user || user.role !== Role.SUPER_ADMIN) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

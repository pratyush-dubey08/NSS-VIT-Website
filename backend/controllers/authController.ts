import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { Role } from '../models/User';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      if (!registrationNumber) {
        return res.status(400).json({ message: 'Registration Number is required for volunteer login' });
      }

      const normalizedRegNo = registrationNumber.trim().toUpperCase();

      user = await User.findOne({ registrationNumber: normalizedRegNo });

      if (!user) {
        return res.status(404).json({ message: 'Volunteer not found with this Registration Number. Please verify your registration number or contact the coordinator.' });
      }

      // If name is provided, verify with flexible whitespace and casing
      if (name && name.trim()) {
        const cleanDbName = user.name.replace(/\s+/g, ' ').trim().toLowerCase();
        const cleanInputName = name.replace(/\s+/g, ' ').trim().toLowerCase();

        const isMatch = cleanDbName === cleanInputName ||
                        cleanDbName.includes(cleanInputName) ||
                        cleanInputName.includes(cleanDbName);

        if (!isMatch) {
          // If name doesn't match, check if email matches
          if (email && user.email && email.trim().toLowerCase() === user.email.toLowerCase()) {
            // Email matches, proceed
          } else {
            return res.status(401).json({ message: 'Name does not match the registration record for this Registration Number' });
          }
        }
      }
    }

    // Generate JWT (Valid for 365 days for persistent login)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '365d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        role: user.role,
        registrationNumber: user.registrationNumber,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        batch: user.batch || '',
        gender: user.gender || '',
        residenceType: user.residenceType || '',
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

export const googleLoginUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google token is required' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token payload' });
    }

    const email = payload.email.toLowerCase();

    // Verify it's a college email
    if (!email.endsWith('@vitbhopal.ac.in')) {
      return res.status(403).json({ message: 'Only @vitbhopal.ac.in emails are allowed' });
    }

    // Find user in DB
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Volunteer not found in database. Please contact the administrator.' });
    }

    // Generate JWT (Valid for 365 days for persistent login)
    const authToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '365d' }
    );

    res.status(200).json({
      message: 'Google Login successful',
      token: authToken,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        role: user.role,
        registrationNumber: user.registrationNumber,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        batch: user.batch || '',
        gender: user.gender || '',
        residenceType: user.residenceType || '',
        accumulatedHours: user.accumulatedHours || 0,
        bunks: user.bunks || 0,
        certificates: user.certificates || []
      }
    });

  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(500).json({ message: 'Google Authentication failed' });
  }
};

export const changeAdminPassword = async (req: Request, res: Response) => {
  try {
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

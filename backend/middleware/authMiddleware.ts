import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

import User from '../models/User';

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;
    
    // Fetch user from DB to ensure they still exist and verify credentials
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // STRICT SECURITY ENFORCEMENT
    // Every single API call made by an admin is double-checked here.
    if (user.role === Role.SUPER_ADMIN && user.email?.toLowerCase() !== 'nss@vitbhopal.ac.in') {
      return res.status(403).json({ message: 'Critical Security Alert: Admin access blocked due to unauthorized email address.' });
    }

    req.user = { userId: user._id.toString(), role: user.role as Role };
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Access denied. User not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. You do not have permission to access this resource.' });
    }

    next();
  };
};

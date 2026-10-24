import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'addy_job_jwt_secret_super_secure_key_2025';

// Extend Express Request to include user payload
export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Middleware: Verify JWT token from Authorization header
 * Attaches decoded user to req.user
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, message: 'Access denied. Invalid token format.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthRequest['user'];
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    } else if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ success: false, message: 'Invalid token. Please login again.' });
    } else {
      res.status(401).json({ success: false, message: 'Authentication failed.' });
    }
  }
};

/**
 * Middleware: Require admin role
 * Must be used AFTER authenticate middleware
 */
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'sadmin') {
    res.status(403).json({
      success: false,
      message: 'Access forbidden. Admin privileges required.',
    });
    return;
  }

  next();
};

/**
 * Middleware: Require company role
 * Must be used AFTER authenticate middleware
 */
export const requireCompany = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  if (req.user.role !== 'company' && req.user.role !== 'admin' && req.user.role !== 'sadmin') {
    res.status(403).json({
      success: false,
      message: 'Access forbidden. Company account required.',
    });
    return;
  }

  next();
};

/**
 * Middleware: Require candidate/job_seeker role
 * Must be used AFTER authenticate middleware
 */
export const requireCandidate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  const allowedRoles = ['candidate', 'job_seeker', 'admin', 'sadmin'];
  if (!allowedRoles.includes(req.user.role)) {
    res.status(403).json({
      success: false,
      message: 'Access forbidden. Candidate account required.',
    });
    return;
  }

  next();
};

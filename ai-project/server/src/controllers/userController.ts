import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Get user stats
export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      success: true,
      stats: {
        total_conversations: 0,
        total_messages: 0,
        member_since: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to get stats',
    });
  }
};

// Logout
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Logged out successfully',
  });
};
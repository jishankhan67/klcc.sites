import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase, supabaseAdmin } from '../services/supabase';
import { generateToken, AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

// Register new user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name },
    });

    if (authError) throw new AppError(authError.message, 400);

    // Create profile in profiles table
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: authData.user!.id,
          email,
          full_name,
          created_at: new Date().toISOString(),
        },
      ]);

    if (profileError) throw new AppError(profileError.message, 400);

    const token = generateToken({ id: authData.user.id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: authData.user.id,
        email,
        full_name,
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Registration failed',
    });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new AppError(error.message, 401);

    const token = generateToken({ id: data.user!.id, email });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name || '',
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Login failed',
    });
  }
};

// Get current user profile
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new AppError(error.message, 404);

    res.json({
      success: true,
      user: data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to get profile',
    });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { full_name, avatar_url } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, avatar_url, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new AppError(error.message, 400);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: data,
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Failed to update profile',
    });
  }
};
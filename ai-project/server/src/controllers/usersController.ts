import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { supabase } from '../supabaseClient';

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, users: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, user: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        plan_id: req.body.plan_id,
        ref_by: req.body.ref_by,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        country_code: req.body.country_code,
        mobile: req.body.mobile,
        password: req.body.password,
        address: req.body.address,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, user: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .update({
        plan_id: req.body.plan_id,
        ref_by: req.body.ref_by,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        country_code: req.body.country_code,
        mobile: req.body.mobile,
        password: req.body.password,
        address: req.body.address,
        balance: req.body.balance,
        status: req.body.status,
        kv: req.body.kv,
        ev: req.body.ev,
        sv: req.body.sv,
        profile_complete: req.body.profile_complete,
        points: req.body.points,
        reward: req.body.reward,
        ref: req.body.ref,
        key: req.body.key,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, user: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUserBalance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('balance')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, balance: data?.balance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserBalance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const { data, error } = await supabase
      .from('users')
      .update({
        balance: req.body.newBalance,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, balance: data?.balance });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
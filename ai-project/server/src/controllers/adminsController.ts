import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const getAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, admins: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, admin: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .insert([{
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, admin: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('admins')
      .update({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, admin: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
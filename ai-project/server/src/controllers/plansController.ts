import { Request, Response } from 'express';
import { supabase } from '../supabaseClient';

export const getPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, plans: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, plan: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('plans')
      .insert([{
        name: req.body.name,
        price: req.body.price,
        daily_limit: req.body.daily_limit,
        status: req.body.status,
        ref_level: req.body.ref_level,
        validity: req.body.validity,
        tagline: req.body.tagline,
        highlight: req.body.highlight,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, plan: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updatePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('plans')
      .update({
        name: req.body.name,
        price: req.body.price,
        daily_limit: req.body.daily_limit,
        status: req.body.status,
        ref_level: req.body.ref_level,
        validity: req.body.validity,
        tagline: req.body.tagline,
        highlight: req.body.highlight,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, plan: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deletePlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Plan deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
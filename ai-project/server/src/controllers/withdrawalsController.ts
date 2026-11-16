import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

export const getWithdrawals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, withdrawals: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getWithdrawal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, withdrawal: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createWithdrawal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('withdrawals')
      .insert([{
        method_id: req.body.method_id,
        user_id: req.body.user_id,
        amount: req.body.amount,
        currency: req.body.currency,
        rate: req.body.rate,
        charge: req.body.charge,
        trx: req.body.trx,
        final_amount: req.body.final_amount,
        after_charge: req.body.after_charge,
        withdraw_information: req.body.withdraw_information,
        status: req.body.status,
        admin_feedback: req.body.admin_feedback,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, withdrawal: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateWithdrawal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('withdrawals')
      .update({
        method_id: req.body.method_id,
        user_id: req.body.user_id,
        amount: req.body.amount,
        currency: req.body.currency,
        rate: req.body.rate,
        charge: req.body.charge,
        trx: req.body.trx,
        final_amount: req.body.final_amount,
        after_charge: req.body.after_charge,
        withdraw_information: req.body.withdraw_information,
        status: req.body.status,
        admin_feedback: req.body.admin_feedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, withdrawal: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteWithdrawal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('withdrawals')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Withdrawal deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
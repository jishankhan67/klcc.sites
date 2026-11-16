import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

export const getDeposits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .select('*');
    
    if (error) throw error;
    
    res.json({ success: true, deposits: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('deposits')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, deposit: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('deposits')
      .insert([{
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
        method_code: req.body.method_code,
        amount: req.body.amount,
        method_currency: req.body.method_currency,
        charge: req.body.charge,
        rate: req.body.rate,
        final_amo: req.body.final_amo,
        detail: req.body.detail,
        btc_amo: req.body.btc_amo,
        btc_wallet: req.body.btc_wallet,
        trx: req.body.trx,
        payment_try: req.body.payment_try,
        status: req.body.status,
        from_api: req.body.from_api,
        admin_feedback: req.body.admin_feedback,
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, deposit: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('deposits')
      .update({
        user_id: req.body.user_id,
        plan_id: req.body.plan_id,
        method_code: req.body.method_code,
        amount: req.body.amount,
        method_currency: req.body.method_currency,
        charge: req.body.charge,
        rate: req.body.rate,
        final_amo: req.body.final_amo,
        detail: req.body.detail,
        btc_amo: req.body.btc_amo,
        btc_wallet: req.body.btc_wallet,
        trx: req.body.trx,
        payment_try: req.body.payment_try,
        status: req.body.status,
        from_api: req.body.from_api,
        admin_feedback: req.body.admin_feedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ success: true, deposit: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('deposits')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    res.json({ success: true, message: 'Deposit deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
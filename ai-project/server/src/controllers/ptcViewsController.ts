import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

export const getPtcAds = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = req.user || {};
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const { data, error } = await supabase
      .from('ptcs')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 1);
    if (error) throw error;
    res.json({ success: true, ads: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getPtcAdDetail = async (req: AuthRequest, res: Response) => {
  try {
    const { id: adId } = req.params;
    const { id: userId } = req.user || {};
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    const { data, error } = await supabase
      .from('ptcs')
      .select('*')
      .eq('id', adId)
      .single();
    if (error) throw error;
    if (!data) {
      res.status(404).json({ success: false, error: 'Ad not found' });
      return;
    }
    res.json({ success: true, ad: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const processPtcView = async (req: AuthRequest, res: Response) => {
  try {
    const { id: userId } = req.user || {};
    const { adId, captchaAnswer } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    if (!adId) {
      res.status(400).json({ success: false, error: 'Ad ID required' });
      return;
    }

    // Get ad details
    const { data: ad, error: adError } = await supabase
      .from('ptcs')
      .select('*')
      .eq('id', adId)
      .single();

    if (adError) throw adError;
    if (!ad) {
      res.status(404).json({ success: false, error: 'Ad not found' });
      return;
    }

    // Get user details
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Check daily limit - count views today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const { count, error: countError } = await supabase
      .from('ptc_views')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('view_date', todayStr);

    if (countError) throw countError;

    // Check daily limit
    if (user.daily_limit && (count || 0) >= user.daily_limit) {
      res.status(400).json({ 
        success: false, 
        error: 'Daily ad limit reached',
        dailyLimit: user.daily_limit,
        viewedToday: count || 0
      });
      return;
    }

    // Check if this specific ad was already viewed today
    const { data: existingView, error: viewError } = await supabase
      .from('ptc_views')
      .select('*')
      .eq('user_id', userId)
      .eq('ptc_id', parseInt(adId))
      .eq('view_date', todayStr)
      .single();

    if (viewError && viewError.code !== 'PGRST116') throw viewError;w viewError;

    if (existingView) {
      res.status(400).json({ 
        success: false, 
        error: 'You have already viewed this ad today' 
      });
      return;
    }

    // Calculate ad amount
    const adAmount = ad.amount || 0;

    // 1. Create ptc_view record
    const { data: viewRecord, error: viewRecordError } = await supabase
      .from('ptc_views')
      .insert({
        user_id: userId,
        ptc_id: parseInt(adId),
        amount: adAmount,
        view_date: todayStr
      })
      .select()
      .single();

    if (viewRecordError) throw viewRecordError;

    // 2. Update user balance
    const newBalance = (user.balance || 0) + adAmount;

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        balance: newBalance,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 3. Create transaction record
    const transactionId = `ptc_${Date.now()}_${userId}`;
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: adAmount,
        post_balance: newBalance,
        trx_type: '+',
        details: `PTC ad view: ${ad.title || 'PTC Ad'}`,
        trx: transactionId,
        remark: 'Ad viewing commission'
      })
      .select()
      .single();

    if (transactionError) throw transactionError;

    // 4. Check referral commissions
    let commissionAmount = 0;
    if (user.ref_by && user.ref_by !== 0) {
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .select('percent, level, commission_type')
        .eq('level', 1)
        .single();

      if (referral && !referralError) {
        const percent = referral.percent / 100;
        commissionAmount = adAmount * percent;

        if (commissionAmount > 0) {
          const { data: referrer, error: referrerError } = await supabase
            .from('users')
            .select('balance')
            .eq('id', user.ref_by)
            .single();

          if (referrer && !referrerError) {
            const newReferrerBalance = (referrer.balance || 0) + commissionAmount;

            await supabase
              .from('users')
              .update({
                balance: newReferrerBalance,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.ref_by);

            // Create commission transaction for referrer
            const refTxId = `ref_commission_${Date.now()}`;
            await supabase
              .from('transactions')
              .insert({
                user_id: user.ref_by,
                amount: commissionAmount,
                post_balance: newReferrerBalance,
                trx_type: '+',
                details: `Referral commission from ad view by user ${userId}`,
                trx: refTxId,
                remark: 'Multi-level referral commission'
              });
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Ad viewed successfully',
      amount: adAmount,
      newBalance,
      transactionId: transaction.id,
      commission: commissionAmount
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
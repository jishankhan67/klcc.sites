import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

// Get user account details
export const getUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user?.id)
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  };
// Update user account
export const updateUserAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: req.body.full_name,
        phone: req.body.phone,
        avatar: req.body.avatar,
        updated_at: new Date().toISOString(),
      })
      .eq('id', req.user?.id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
// Activate a plan for user
export const activatePlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan_id } = req.body;

    if (!plan_id) {
      res.status(400).json({ success: false, error: 'Plan ID is required' });
      return;
    }

    // Check if plan exists
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError) throw planError;
    if (!plan) {
      res.status(404).json({ success: false, error: 'Plan not found' });
      return;
    }

    // Activate the plan for user
    const { data, error } = await supabase
// Process daily task
export const dailyTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { task_id, completed } = req.body;

    if (!task_id) {
      res.status(400).json({ success: false, error: 'Task ID is required' });
      return;
    }

    // Check if today's task already recorded
    const { data: existingTask } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', req.user?.id)
      .eq('task_id', task_id)
      .single();

    let data, error;

    if (existingTask) {
      // Update existing task
      const { error: updateError } = await supabase
        .from('daily_tasks')
        .update({
// Get user earnings
export const getEarnings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('user_earnings')
      .select('*')
      .eq('user_id', req.user?.id);

    if (error) throw error;

    res.json({ success: true, earnings: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  };
          completed,
          completed_at: completed ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingTask.id)
        .select()
// Invest in a plan
export const investInPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { plan_id, amount } = req.body;

    if (!plan_id || !amount) {
      res.status(400).json({ success: false, error: 'Plan ID and amount are required' });
      return;
    }

    // Check if plan exists and get details
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', plan_id)
      .single();

    if (planError) throw planError;
    if (!plan) {
      res.status(404).json({ success: false, error: 'Plan not found' });
      return;
    }

    // Check if user already has active plan
    const { data: existingPlan } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', req.user?.id)
      .eq('plan_id', plan_id)
      .eq('status', 'active')
      .single();

    if (existingPlan) {
      res.status(400).json({ success: false, error: 'You already have an active plan' });
      return;
    }

    // Create user plan entry
    const { data, error } = await supabase
      .from('user_plans')
      .insert([{
        user_id: req.user?.id,
        plan_id: plan_id,
        invested_amount: amount,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + plan.validity * 24 * 60 * 60 * 1000).toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user_plan: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  };
        .single();

      if (updateError) throw updateError;
      data = existingTask;
    } else {
      // Create new task record
      const { error: insertError } = await supabase
        .from('daily_tasks')
        .insert([{
          user_id: req.user?.id,
          task_id,
          completed,
          started_at: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : null,
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      data = { id: Date.now(), user_id: req.user?.id, task_id, completed };
    }

    // If task completed, add earnings
    if (completed) {
      // Get task reward amount
      const { data: task } = await supabase
        .from('daily_tasks_config')
        .select('reward_amount')
        .eq('task_id', task_id)
        .single();

      if (task && task.reward_amount) {
        // Add earnings to user
        await supabase
          .from('user_earnings')
          .insert([{
            user_id: req.user?.id,
            amount: task.reward_amount,
            type: 'daily_task',
            reference_id: data.id,
            description: `Daily task: ${task_id}`,
            created_at: new Date().toISOString(),
          }]);
      }
    }

    res.json({ success: true, task: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  };
      .from('user_plans')
      .insert([{
        user_id: req.user?.id,
        plan_id: plan_id,
        status: 'active',
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + plan.validity * 24 * 60 * 60 * 1000).toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, user_plan: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  };
  };
import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { supabase } from '../supabaseClient';

// Spin reward wheel
export const spinReward = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Generate random reward
    const random = Math.random();
    let reward_amount = 0;
    let reward_type = 'none';

    if (random < 0.1) {
      // 10% chance for jackpot
      reward_amount = 100;
      reward_type = 'jackpot';
    } else if (random < 0.3) {
      // 20% chance for medium reward
      reward_amount = 25;
      reward_type = 'medium';
    } else if (random < 0.6) {
      // 30% chance for small reward
      reward_amount = 10;
      reward_type = 'small';
    } else {
      // 40% chance for no reward
      reward_amount = 0;
      reward_type = 'none';
    }

    // Record the spin
    const { data, error } = await supabase
      .from('user_spins')
      .insert([{
        user_id: req.user?.id,
        reward_amount,
        reward_type,
        spin_date: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    // If reward, add to earnings
    if (reward_amount > 0) {
      await supabase
        .from('user_earnings')
        .insert([{
          user_id: req.user?.id,
          amount: reward_amount,
          type: 'spin_reward',
          reference_id: data.id,
          description: `Spin reward (${reward_type}): $${reward_amount}`,
          created_at: new Date().toISOString(),
        }]);
    }

    res.json({ success: true, reward: { amount: reward_amount, type: reward_type } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Manual crypto deposit
export const manualDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount, crypto_wallet, tx_hash, coin_type } = req.body;

    if (!amount || !crypto_wallet || !tx_hash || !coin_type) {
      res.status(400).json({ success: false, error: 'All fields are required: amount, crypto_wallet, tx_hash, coin_type' });
      return;
    }

    // Create deposit record
    const { data, error } = await supabase
      .from('deposits')
      .insert([{
        user_id: req.user?.id,
        plan_id: req.body.plan_id || null,
        method_code: `manual_${coin_type}`,
        amount,
        method_currency: coin_type,
        charge: 0,
        rate: 1,
        final_amo: amount,
        detail: `Manual ${coin_type} deposit`,
        btc_amo: 0,
        btc_wallet: '',
        trx: tx_hash,
        payment_try: 'manual',
        status: 'pending',
        from_api: false,
        admin_feedback: null,
      }])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, deposit: data, message: 'Deposit submitted pending admin approval' });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Register user bonus
export const registerBonus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bonus_code, amount } = req.body;

    if (!bonus_code) {
      res.status(400).json({ success: false, error: 'Bonus code is required' });
      return;
    }

    // Check if bonus already used
    const { data: existingBonus } = await supabase
      .from('user_bonuses')
      .select('*')
      .eq('user_id', req.user?.id)
      .eq('bonus_code', bonus_code)
      .single();

    if (existingBonus) {
      res.status(400).json({ success: false, error: 'This bonus code has already been used' });
      return;
    }

    // Register the bonus
    const { data, error } = await supabase
      .from('user_bonuses')
      .insert([{
        user_id: req.user?.id,
        bonus_code,
        amount: amount || 0,
        status: 'pending',
        used_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    // Add bonus amount to earnings
    if (amount && amount > 0) {
      await supabase
        .from('user_earnings')
        .insert([{
          user_id: req.user?.id,
          amount,
          type: 'bonus',
          reference_id: data.id,
          description: `Bonus registration: ${bonus_code}`,
          created_at: new Date().toISOString(),
        }]);
    }

    res.json({ success: true, bonus: data });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
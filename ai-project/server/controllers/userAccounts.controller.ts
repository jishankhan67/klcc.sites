import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user account details
export const getUserAccount = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        userPlan: {
          include: { plan: true },
          order: { startedAt: 'desc' },
        },
        userEarnings: {
          take: 10,
          order: { createdAt: 'desc' },
        },
      },
    });

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Update user account
export const updateUserAccount = async (req: Request, res: Response) => {
  try {
    const { fullName, phone, avatar } = req.body;
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, phone, avatar },
    });

    return res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Activate plan
export const activatePlan = async (req: Request, res: Response) => {
  try {
    const { planId } = req.body;

    // Check if user already has active plan
    const existingPlan = await prisma.userPlan.findFirst({
      where: {
        userId: req.user.id,
        status: 'active',
      },
    });

    if (existingPlan) {
      return res.status(400).json({ success: false, message: 'You already have an active plan' });
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    await prisma.userPlan.create({
      data: {
        userId: req.user.id,
        planId,
        status: 'active',
        investedAmount: plan.price,
        expiresAt: new Date(Date.now() + plan.validity * 24 * 60 * 60 * 1000),
      },
    });

    // Set daily earnings limit
    await prisma.user.update({
      where: { id: req.user.id },
      data: { dailyEarnings: plan.dailyLimit },
    });

    return res.json({ success: true, message: 'Plan activated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Process daily task
export const dailyTask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.body;

    await prisma.userEarning.create({
      data: {
        userId: req.user.id,
        amount: 1.0, // task reward
        type: 'daily_task',
        description: `Daily task: ${taskId}`,
      },
    });

    return res.json({ success: true, message: 'Daily task completed successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get user earnings
export const getEarnings = async (req: Request, res: Response) => {
  try {
    const earnings = await prisma.userEarning.findMany({
      where: { userId: req.user.id },
      take: 50,
      order: { createdAt: 'desc' },
    });

    const totalEarnings = await prisma.userEarning.aggregate({
      where: { userId: req.user.id },
      _sum: { amount: true },
    });

    return res.json({ success: true, earnings, total: totalEarnings._sum.amount || 0 });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Invest in plan
export const investInPlan = async (req: Request, res: Response) => {
  try {
    const { planId, amount } = req.body;

    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    // Check if user already has active plan
    const existingPlan = await prisma.userPlan.findFirst({
      where: {
        userId: req.user.id,
        status: 'active',
      },
    });

    if (existingPlan) {
      return res.status(400).json({ success: false, message: 'You already have an active plan' });
    }

    await prisma.userPlan.create({
      data: {
        userId: req.user.id,
        planId,
        status: 'active',
        investedAmount: amount || plan.price,
      },
    });

    return res.json({ success: true, message: 'Plan investment successful' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Manual crypto deposit
export const manualDeposit = async (req: Request, res: Response) => {
  try {
    const { amount, gateway, txHash } = req.body;

    const deposit = await prisma.deposit.create({
      data: {
        userId: req.user.id,
        gateway,
        amount,
        trx: txHash,
        status: 0, // Pending
      },
    });

    return res.json({ success: true, deposit, message: 'Deposit submitted pending approval' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Register bonus
export const registerBonus = async (req: Request, res: Response) => {
  try {
    const { bonusCode } = req.body;

    // Check if bonus already used
    const existingBonus = await prisma.$queryRaw`
      SELECT COUNT(*) as count FROM UserEarning WHERE userId = ${req.user.id} AND description LIKE '%${bonusCode}%'
    `;

    if ((existingBonus as any)[0].count > 0) {
      return res.status(400).json({ success: false, message: 'This bonus code has already been used' });
    }

    // Add bonus to earnings
    await prisma.userEarning.create({
      data: {
        userId: req.user.id,
        amount: 5.0, // bonus amount
        type: 'bonus',
        description: `Bonus registration: ${bonusCode}`,
      },
    });

    return res.json({ success: true, message: 'Bonus registered successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
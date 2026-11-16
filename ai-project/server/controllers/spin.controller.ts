import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const executeDailySpin = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);

    // Check if user already spun today
    const existingSpin = await prisma.spinLog.findFirst({
      where: {
        userId,
        spinDate: {
          gte: new Date(today),
        },
      },
    });

    if (existingSpin) {
      return res.status(400).json({ success: false, message: 'You have already used your daily spin today!' });
    }

    // Fetch active spin prizes
    const prizes = await prisma.spinSetting.findMany({ where: { status: 1 } });
    if (prizes.length === 0) {
      return res.status(404).json({ success: false, message: 'No active spin prizes available.' });
    }

    // Weighted random selection
    let random = Math.random();
    let cumulativeProb = 0;
    let selectedPrize = prizes[0];

    for (const prize of prizes) {
      cumulativeProb += prize.probability / 100;
      if (random <= cumulativeProb) {
        selectedPrize = prize;
        break;
      }
    }

    // Log the spin
    await prisma.spinLog.create({
      data: {
        userId,
        amount: selectedPrize.amount,
      },
    });

    // Update user balance if prize has cash value
    if (Number(selectedPrize.amount) > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: selectedPrize.amount } },
      });
    }

    // Record user earning
    await prisma.userEarning.create({
      data: {
        userId,
        amount: selectedPrize.amount,
        type: 'spin_reward',
        description: `Spin reward: ${selectedPrize.title}`,
      },
    });

    return res.json({
      success: true,
      message: `Congratulations! You won ${selectedPrize.title}`,
      amount: selectedPrize.amount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
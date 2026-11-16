import { Router } from 'express';
import {
  getUserAccount,
  updateUserAccount,
  activatePlan,
  dailyTask,
  getEarnings,
  investInPlan,
  spinReward,
  manualDeposit,
  registerBonus
} from '../controllers/userAccountsController';

const router = Router();

router.get('/', authenticateToken, getUserAccount);
router.put('/', authenticateToken, updateUserAccount);
router.post('/activate-plan', authenticateToken, activatePlan);
router.post('/daily-task', authenticateToken, dailyTask);
router.get('/earnings', authenticateToken, getEarnings);
router.post('/invest', authenticateToken, investInPlan);
router.post('/spin-reward', authenticateToken, spinReward);
router.post('/manual-deposit', authenticateToken, manualDeposit);
router.post('/register-bonus', authenticateToken, registerBonus);

export default router;
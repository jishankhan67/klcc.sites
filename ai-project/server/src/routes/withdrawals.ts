import { Router } from 'express';
import {
  getWithdrawals,
  getWithdrawal,
  createWithdrawal,
  updateWithdrawal,
  deleteWithdrawal,
} from '../controllers/withdrawalsController';

const router = Router();

router.get('/', authenticateToken, getWithdrawals);
router.get('/:id', authenticateToken, getWithdrawal);
router.post('/', authenticateToken, createWithdrawal);
router.put('/:id', authenticateToken, updateWithdrawal);
router.delete('/:id', authenticateToken, deleteWithdrawal);

export default router;
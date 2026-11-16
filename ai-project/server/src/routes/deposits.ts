import { Router } from 'express';
import {
  getDeposits,
  getDeposit,
  createDeposit,
  updateDeposit,
  deleteDeposit,
} from '../controllers/depositsController';

const router = Router();

router.get('/', authenticateToken, getDeposits);
router.get('/:id', authenticateToken, getDeposit);
router.post('/', authenticateToken, createDeposit);
router.put('/:id', authenticateToken, updateDeposit);
router.delete('/:id', authenticateToken, deleteDeposit);

export default router;
import { Router } from 'express';
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserBalance,
  updateUserBalance,
} from '../controllers/usersController';

const router = Router();

router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUser);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);
router.get('/:id/balance', authenticateToken, getUserBalance);
router.put('/:id/balance', authenticateToken, updateUserBalance);

export default router;
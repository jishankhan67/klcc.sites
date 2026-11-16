import { Router } from 'express';
import {
  getAdmins,
  getAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../controllers/adminsController';

const router = Router();

router.get('/', authenticateToken, getAdmins);
router.get('/:id', authenticateToken, getAdmin);
router.post('/', authenticateToken, createAdmin);
router.put('/:id', authenticateToken, updateAdmin);
router.delete('/:id', authenticateToken, deleteAdmin);

export default router;
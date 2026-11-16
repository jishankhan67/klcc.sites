import { Router } from 'express';
import { getUserStats, logout } from '../controllers/userController';

const router = Router();

router.get('/stats', getUserStats);
router.post('/logout', logout);

export default router;
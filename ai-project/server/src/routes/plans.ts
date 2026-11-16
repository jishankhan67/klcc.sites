import { Router } from 'express';
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/plansController';

const router = Router();

router.get('/', authenticateToken, getPlans);
router.get('/:id', authenticateToken, getPlan);
router.post('/', authenticateToken, createPlan);
router.put('/:id', authenticateToken, updatePlan);
router.delete('/:id', authenticateToken, deletePlan);

export default router;
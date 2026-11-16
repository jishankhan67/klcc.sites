import { Router } from 'express';
import {
  getPtcAds,
  getPtcAdDetail,
  processPtcView,
} from '../Controllers/ptcViewsController';

const router = Router();

// GET /api/ptc - List active PT ads for user
router.get('/', authenticateToken, getPtcAds);

// GET /api/ptc/show/:id - Get ad details for viewing with daily limit check
router.get('/show/:id', authenticateToken, getPtcAdDetail);

// POST /api/ptc/view - Process ad view with captcha validation
router.post('/view', authenticateToken, processPtcView);

export default router;
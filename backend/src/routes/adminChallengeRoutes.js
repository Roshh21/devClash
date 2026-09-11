import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { createChallenge, getChallenge, updateChallenge } from '../controllers/adminChallengeController.js';

const router = Router();

// Every route below requires both a valid session and the admin role.
router.use(requireAuth, requireAdmin);

router.post('/', createChallenge);
router.get('/:id', getChallenge);
router.patch('/:id', updateChallenge);

export default router;

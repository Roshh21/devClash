import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import {
  listUsers,
  blockUser,
  unblockUser,
  promoteUser,
  demoteUser,
  removeUser,
} from '../controllers/adminUserController.js';

const router = Router();

// Every route below requires both a valid session and the admin role.
router.use(requireAuth, requireAdmin);

router.get('/', listUsers);
router.patch('/:id/block', blockUser);
router.patch('/:id/unblock', unblockUser);
router.patch('/:id/promote', promoteUser);
router.patch('/:id/demote', demoteUser);
router.delete('/:id', removeUser);

export default router;

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

router.get('/users', listUsers);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);
router.patch('/users/:id/promote', promoteUser);
router.patch('/users/:id/demote', demoteUser);
router.delete('/users/:id', removeUser);

export default router;

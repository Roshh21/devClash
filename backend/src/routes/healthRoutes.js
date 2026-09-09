import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

// readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const MONGO_STATE_LABELS = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// GET /health — deliberately always returns 200 (it's a liveness
// check for the process, not the database), but reports Mongo's
// actual connection state so a flaky DB shows up here rather than
// only surfacing as a mysterious 500 somewhere else.
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    mongo: { state: MONGO_STATE_LABELS[mongoose.connection.readyState] || 'unknown' },
  });
});

export default router;

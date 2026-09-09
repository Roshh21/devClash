import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

async function start() {
  try {
    await connectDB(config.mongodbUri);
  } catch (err) {
    console.error('[server] Failed to connect to MongoDB:', err.message);
    console.error('[server] Check MONGODB_URI in backend/.env — see backend/.env.example.');
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[server] DevClash API listening on http://localhost:${config.port}`);
    console.log(`[server] Health check: http://localhost:${config.port}/health`);
  });
}

start();

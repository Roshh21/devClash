import mongoose from 'mongoose';
import { config } from '../config/env.js';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

// The only way to get an admin account, by design: there's no signup
// flow or API endpoint that creates one (every signup defaults to
// 'user' — see models/User.js and controllers/authController.js), and
// every existing admin-management endpoint requires an admin to
// already be logged in (routes/adminUserRoutes.js). Something has to
// break that chicken-and-egg problem — this is it.
//
// Usage (from backend/):
//   npm run seed:admin -- you@example.com
//
// Sign up for a real account first through the frontend, THEN run
// this with that account's email.
async function main() {
  const email = process.argv[2]?.trim().toLowerCase();

  if (!email) {
    console.error('Usage: npm run seed:admin -- you@example.com');
    process.exit(1);
  }

  await connectDB(config.mongodbUri);

  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No account found for ${email}. Sign up through the frontend first, then re-run this.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  if (user.role === 'admin') {
    console.log(`${user.username} <${user.email}> is already an admin. Nothing to do.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  user.role = 'admin';
  await user.save();

  console.log(`Done — ${user.username} <${user.email}> is now an admin.`);
  console.log('Refresh the frontend (or log out and back in) to pick up the new role — it only');
  console.log('re-checks the role when the app loads, not automatically mid-session.');

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed:admin] failed:', err.message);
  process.exit(1);
});

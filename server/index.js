import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { initDb } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import { runScraper } from './services/scraper.js';

// Routes
import authRoutes from './routes/auth.js';
import grantsRoutes from './routes/grants.js';
import proposalsRoutes from './routes/proposals.js';
import notificationsRoutes from './routes/notifications.js';
import profileRoutes from './routes/profile.js';
import agentRoutes from './routes/agent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/grants', grantsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/agent', agentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
    try {
        // Initialize database (async for sql.js)
        await initDb();
        console.log('✓ Database ready');

        // Seed initial data
        seedDatabase();
        console.log('✓ Seed complete');

        // Schedule agent runs (default: every 6 hours)
        const cronSchedule = process.env.AGENT_CRON_SCHEDULE || '0 */6 * * *';
        cron.schedule(cronSchedule, async () => {
            console.log('[Cron] Starting scheduled agent scan...');
            try {
                await runScraper();
            } catch (err) {
                console.error('[Cron] Scheduled scan failed:', err.message);
            }
        });
        console.log(`✓ Agent cron scheduled: ${cronSchedule}`);

        app.listen(PORT, () => {
            console.log(`\n🚀 GIAA AI Grant Agent API running at http://localhost:${PORT}`);
            console.log(`   Health: http://localhost:${PORT}/api/health`);
            console.log(`   Auth:   POST http://localhost:${PORT}/api/auth/login`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

start();

import { Router } from 'express';
import { dbGet, dbAll } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { runScraper } from '../services/scraper.js';

const router = Router();

let agentRunning = false;

// GET /api/agent/status
router.get('/status', authenticateToken, (req, res) => {
    try {
        const lastLog = dbGet('SELECT * FROM agent_logs ORDER BY started_at DESC LIMIT 1');
        const logs = dbAll('SELECT * FROM agent_logs ORDER BY started_at DESC LIMIT 20');

        const totalFoundRow = dbGet('SELECT COALESCE(SUM(grants_found), 0) as total FROM agent_logs WHERE status = "COMPLETED"');
        const totalMatchedRow = dbGet('SELECT COALESCE(SUM(grants_matched), 0) as total FROM agent_logs WHERE status = "COMPLETED"');

        res.json({
            success: true,
            data: {
                agent: {
                    id: '1',
                    name: 'GIAA Grant Intelligence Agent',
                    status: agentRunning ? 'ACTIVE' : (lastLog?.status === 'FAILED' ? 'ERROR' : 'ACTIVE'),
                    lastRun: lastLog?.completed_at || lastLog?.started_at || null,
                    nextRun: null,
                    tasks: [],
                    configuration: {
                        searchKeywords: ['education grant Africa', 'STEM funding Nigeria', 'AI education grant', 'robotics school funding', 'inclusive education Africa'],
                        grantSources: [
                            { id: '1', name: 'fundsforNGOs', url: 'https://fundsforngos.org', type: 'WEBSITE', isActive: true, lastScraped: lastLog?.completed_at || null },
                            { id: '2', name: 'Opportunity Desk', url: 'https://opportunitydesk.org', type: 'WEBSITE', isActive: true, lastScraped: lastLog?.completed_at || null },
                            { id: '3', name: 'Grants.gov', url: 'https://grants.gov', type: 'API', isActive: true, lastScraped: lastLog?.completed_at || null }
                        ],
                        notificationSettings: { emailEnabled: false, whatsappEnabled: true, digestFrequency: 'WEEKLY', urgentAlertsEnabled: true, recipients: [] },
                        autoDraftEnabled: false,
                        filteringCriteria: { minAmount: 10000, maxAmount: 500000, categories: ['STEM', 'AI_EDUCATION', 'ROBOTICS', 'EDUCATION_INNOVATION', 'INCLUSIVE_EDUCATION', 'TECHNOLOGY'], eligibleRegions: ['Nigeria', 'West Africa', 'Africa'], deadlineRange: 180 }
                    },
                    stats: {
                        totalGrantsFound: totalFoundRow?.total || 0,
                        totalGrantsFiltered: totalMatchedRow?.total || 0,
                        totalApplicationsSubmitted: dbGet('SELECT COUNT(*) as c FROM grants WHERE status = "SUBMITTED"')?.c || 0,
                        totalFundingSecured: dbGet('SELECT COALESCE(SUM(amount_max), 0) as t FROM grants WHERE status = "FUNDED"')?.t || 0,
                        successRate: 0,
                        averageResponseTime: 14
                    }
                },
                isRunning: agentRunning,
                logs: (logs || []).map(l => ({
                    id: l.id,
                    action: l.action,
                    status: l.status,
                    details: l.details,
                    grantsFound: l.grants_found,
                    grantsMatched: l.grants_matched,
                    error: l.error,
                    startedAt: l.started_at,
                    completedAt: l.completed_at
                }))
            }
        });
    } catch (err) {
        console.error('Agent status error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/agent/run
router.post('/run', authenticateToken, (req, res) => {
    if (agentRunning) {
        return res.json({ success: false, error: 'Agent is already running' });
    }

    agentRunning = true;
    res.json({ success: true, message: 'Agent started' });

    runScraper()
        .then(result => {
            console.log('[Agent] Scraping complete:', result);
        })
        .catch(err => {
            console.error('[Agent] Scraping failed:', err);
        })
        .finally(() => {
            agentRunning = false;
        });
});

export default router;

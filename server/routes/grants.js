import { Router } from 'express';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

function safeJSON(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
}

function formatGrant(row) {
    return {
        id: String(row.id),
        name: row.name,
        organization: row.organization,
        amount: { min: row.amount_min, max: row.amount_max, currency: row.currency },
        deadline: row.deadline,
        description: row.description,
        eligibility: safeJSON(row.eligibility, []),
        category: row.category,
        relevanceScore: row.relevance_score,
        status: row.status,
        requirements: safeJSON(row.requirements, []),
        documents: safeJSON(row.documents, []),
        contactEmail: row.contact_email,
        websiteUrl: row.website_url,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        aiSummary: row.ai_summary,
        applicationReadiness: {
            score: row.readiness_score || 0,
            missingRequirements: safeJSON(row.readiness_missing, []),
            strengths: safeJSON(row.readiness_strengths, []),
            recommendations: safeJSON(row.readiness_recommendations, []),
            estimatedSuccessRate: row.estimated_success_rate || 0
        },
        source: row.source
    };
}

// GET /api/grants/stats/dashboard — must be before /:id
router.get('/stats/dashboard', authenticateToken, (req, res) => {
    try {
        const totalGrants = dbGet('SELECT COUNT(*) as count FROM grants').count;
        const activeApplications = dbGet('SELECT COUNT(*) as count FROM grants WHERE status IN ("APPLYING","SUBMITTED")').count;
        const pendingReview = dbGet('SELECT COUNT(*) as count FROM grants WHERE status = "REVIEWING"').count;
        const fundedGrants = dbGet('SELECT COUNT(*) as count FROM grants WHERE status = "FUNDED"').count;
        const totalFunding = dbGet('SELECT COALESCE(SUM(amount_max), 0) as total FROM grants WHERE status = "FUNDED"').total;
        const upcomingDeadlines = dbGet('SELECT COUNT(*) as count FROM grants WHERE deadline > date("now") AND deadline <= date("now", "+30 days")').count;
        const aiMatches = dbGet('SELECT COUNT(*) as count FROM grants WHERE relevance_score = "HIGH"').count;
        const submitted = dbGet('SELECT COUNT(*) as count FROM grants WHERE status IN ("SUBMITTED","FUNDED","REJECTED")').count;
        const successRate = submitted > 0 ? Math.round((fundedGrants / submitted) * 100) : 0;

        res.json({
            success: true,
            data: { totalGrants, activeApplications, pendingReview, fundedGrants, totalFunding, upcomingDeadlines, aiMatches, successRate }
        });
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/grants/alerts/deadlines — must be before /:id
router.get('/alerts/deadlines', authenticateToken, (req, res) => {
    try {
        const alerts = dbAll(`
      SELECT id, name, deadline,
        CAST(julianday(deadline) - julianday('now') AS INTEGER) as days_remaining
      FROM grants
      WHERE deadline IS NOT NULL AND deadline > date('now') AND status NOT IN ('FUNDED','REJECTED')
      ORDER BY deadline ASC LIMIT 10
    `);

        const formatted = alerts.map(a => ({
            id: String(a.id),
            grantId: String(a.id),
            grantName: a.name,
            deadline: a.deadline,
            daysRemaining: a.days_remaining,
            priority: a.days_remaining <= 7 ? 'URGENT' : a.days_remaining <= 30 ? 'HIGH' : 'MEDIUM',
            status: 'PENDING'
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/grants
router.get('/', authenticateToken, (req, res) => {
    try {
        const { category, status, relevance, search, limit = 50 } = req.query;

        let query = 'SELECT * FROM grants WHERE 1=1';
        const params = [];

        if (category) { query += ' AND category = ?'; params.push(category); }
        if (status) { query += ' AND status = ?'; params.push(status); }
        if (relevance) { query += ' AND relevance_score = ?'; params.push(relevance); }
        if (search) { query += ' AND (name LIKE ? OR description LIKE ? OR organization LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(Number(limit));

        const grants = dbAll(query, params).map(formatGrant);
        res.json({ success: true, data: grants });
    } catch (err) {
        console.error('Grants fetch error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/grants/:id
router.get('/:id', authenticateToken, (req, res) => {
    try {
        const grant = dbGet('SELECT * FROM grants WHERE id = ?', [req.params.id]);
        if (!grant) return res.status(404).json({ success: false, error: 'Grant not found' });
        res.json({ success: true, data: formatGrant(grant) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PATCH /api/grants/:id/status
router.patch('/:id/status', authenticateToken, (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['NEW', 'REVIEWING', 'APPLYING', 'SUBMITTED', 'FUNDED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        dbRun('UPDATE grants SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, req.params.id]);

        const grant = dbGet('SELECT * FROM grants WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: formatGrant(grant) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;

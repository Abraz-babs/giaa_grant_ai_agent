import { Router } from 'express';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

function safeJSON(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
}

// GET /api/proposals
router.get('/', authenticateToken, (req, res) => {
    try {
        const proposals = dbAll('SELECT * FROM proposals ORDER BY updated_at DESC');
        const formatted = proposals.map(p => ({
            id: String(p.id),
            grantId: String(p.grant_id),
            title: p.title,
            content: safeJSON(p.content, []),
            status: p.status,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
            aiGenerated: !!p.ai_generated,
            version: p.version
        }));
        res.json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/proposals
router.post('/', authenticateToken, (req, res) => {
    try {
        const { grantId, title } = req.body;
        const grant = dbGet('SELECT * FROM grants WHERE id = ?', [grantId]);
        if (!grant) return res.status(404).json({ success: false, error: 'Grant not found' });

        const sections = [
            { id: '1', title: 'Executive Summary', content: `Glisten International Academy seeks funding through the ${grant.name} program to advance our mission of excellence in education.`, wordCount: 20, maxWords: 300 },
            { id: '2', title: 'Project Description', content: `This project will leverage the ${grant.name} to expand our initiatives. Building on our existing programs, we aim to create measurable educational impact.`, wordCount: 25, maxWords: 500 },
            { id: '3', title: 'Budget Justification', content: 'Detailed budget allocation will cover equipment, training, curriculum development, and sustainability measures.', wordCount: 15, maxWords: 400 },
            { id: '4', title: 'Impact & Evaluation', content: 'Success will be measured through student performance metrics, participation rates, and long-term outcomes tracking.', wordCount: 15, maxWords: 400 }
        ];

        const result = dbRun(
            'INSERT INTO proposals (grant_id, user_id, title, content, ai_generated) VALUES (?, ?, ?, ?, 1)',
            [grantId, req.user.id, title || `Proposal for ${grant.name}`, JSON.stringify(sections)]
        );

        const proposal = dbGet('SELECT * FROM proposals WHERE id = ?', [result.lastInsertRowid]);

        res.json({
            success: true,
            data: {
                id: String(proposal.id),
                grantId: String(proposal.grant_id),
                title: proposal.title,
                content: JSON.parse(proposal.content),
                status: proposal.status,
                createdAt: proposal.created_at,
                updatedAt: proposal.updated_at,
                aiGenerated: true,
                version: proposal.version
            }
        });
    } catch (err) {
        console.error('Proposal create error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PATCH /api/proposals/:id
router.patch('/:id', authenticateToken, (req, res) => {
    try {
        const { content, status, title } = req.body;
        if (content) dbRun('UPDATE proposals SET content = ?, updated_at = datetime("now"), version = version + 1 WHERE id = ?', [JSON.stringify(content), req.params.id]);
        if (status) dbRun('UPDATE proposals SET status = ?, updated_at = datetime("now") WHERE id = ?', [status, req.params.id]);
        if (title) dbRun('UPDATE proposals SET title = ?, updated_at = datetime("now") WHERE id = ?', [title, req.params.id]);

        const proposal = dbGet('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
        res.json({ success: true, data: proposal });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;

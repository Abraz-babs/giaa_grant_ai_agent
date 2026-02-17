import { Router } from 'express';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

function safeJSON(str, fallback) {
    try { return JSON.parse(str); } catch { return fallback; }
}

// GET /api/notifications
router.get('/', authenticateToken, (req, res) => {
    try {
        const notifications = dbAll(
            'SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC LIMIT 50',
            [req.user.id]
        );
        const formatted = notifications.map(n => ({
            id: String(n.id),
            type: n.type,
            title: n.title,
            message: n.message,
            data: safeJSON(n.data, {}),
            read: !!n.read,
            createdAt: n.created_at,
            priority: n.priority
        }));
        res.json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/notifications/unread-count
router.get('/unread-count', authenticateToken, (req, res) => {
    try {
        const result = dbGet(
            'SELECT COUNT(*) as count FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND read = 0',
            [req.user.id]
        );
        res.json({ success: true, data: { count: result.count } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticateToken, (req, res) => {
    try {
        dbRun('UPDATE notifications SET read = 1 WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// POST /api/notifications/mark-all-read
router.post('/mark-all-read', authenticateToken, (req, res) => {
    try {
        dbRun('UPDATE notifications SET read = 1 WHERE user_id = ? OR user_id IS NULL', [req.user.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;

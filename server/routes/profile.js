import { Router } from 'express';
import { dbGet, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/profile
router.get('/', authenticateToken, (req, res) => {
    try {
        const row = dbGet('SELECT data FROM school_profile LIMIT 1');
        if (!row) return res.status(404).json({ success: false, error: 'Profile not found' });
        res.json({ success: true, data: JSON.parse(row.data) });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// PUT /api/profile
router.put('/', authenticateToken, (req, res) => {
    try {
        const profileData = req.body;
        dbRun('UPDATE school_profile SET data = ?, updated_at = datetime("now") WHERE id = 1', [JSON.stringify(profileData)]);
        res.json({ success: true, data: profileData });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbAll, dbRun } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'giaa-fallback-secret';

// POST /api/auth/login
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        const valid = bcrypt.compareSync(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }

        // Update last_login
        dbRun('UPDATE users SET last_login = datetime("now") WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: { token, user: userWithoutPassword }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/auth/verify
router.get('/verify', authenticateToken, (req, res) => {
    try {
        const user = dbGet('SELECT id, name, email, role, phone, avatar, created_at, last_login FROM users WHERE id = ?', [req.user.id]);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.json({ success: true, data: { user } });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// GET /api/auth/users
router.get('/users', authenticateToken, (req, res) => {
    try {
        const users = dbAll('SELECT id, name, email, role, phone, avatar, created_at, last_login FROM users');
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

export default router;

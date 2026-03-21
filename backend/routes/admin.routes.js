// backend/routes/admin.routes.js
const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const router = express.Router();

// GET /api/admin/users - List all non-admin members
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/admin/users/:id/status - Toggle active/inactive
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.status = user.status === 'active' ? 'inactive' : 'active';
        await user.save();
        
        res.json({ message: `User status updated to ${user.status}`, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
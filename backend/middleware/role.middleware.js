// backend/middleware/role.middleware.js

// Admin-only guard
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
};

// Member or Admin guard
const memberOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'member' || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Member privileges required.' });
    }
};

module.exports = { memberOrAdmin, adminOnly };
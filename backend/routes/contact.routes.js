// backend/routes/contact.routes.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth.middleware');

// POST /api/contacts - Public: Anyone can submit a contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Create the new message in the database
        const newContact = await Contact.create({ name, email, message });
        
        res.status(201).json({ success: true, message: 'Message sent successfully!', data: newContact });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/contacts - Protected: Only Admins can view all messages
router.get('/', protect, async (req, res) => {
    try {
        // Security Check: Make sure the logged-in user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        // Fetch all messages and sort them so the newest ones appear at the top (-1)
        const messages = await Contact.find().sort({ createdAt: -1 });
        
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
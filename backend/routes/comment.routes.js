// backend/routes/comment.routes.js
const express = require('express');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const router = express.Router();

// GET /api/comments/all - Protected Admin Route: Get all site comments
router.get('/all', protect, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        // Get all comments, populate the author's name, and put newest first
        const comments = await Comment.find()
            .populate('author', 'name')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/comments/:postId - Public: All comments for a post
router.get('/:postId', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name profilePic')
            .sort({ createdAt: 1 }); // oldest first
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/comments/:postId - Member/Admin: Add a comment
router.post('/:postId', protect, memberOrAdmin, async (req, res) => {
    try {
        const comment = await Comment.create({
            post: req.params.postId,
            author: req.user.id,
            body: req.body.body,
        });
        await comment.populate('author', 'name profilePic');
        res.status(201).json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/comments/:id - Protected: Delete a comment (Author or Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        // Security Check: Is the logged-in user the author? (Or an admin?)
        if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
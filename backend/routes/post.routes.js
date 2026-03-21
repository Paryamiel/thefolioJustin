// backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const router = express.Router();

// GET /api/posts - Public: Get all published posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' }).populate('author', 'name profilePic').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/posts/:id - Public: Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name profilePic');
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/posts - Member/Admin: Create new post (with optional image)
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
    try {
        // CHANGED: We now look for 'content' to perfectly match your React frontend!
        const { title, content } = req.body; 
        
        const post = await Post.create({
            title,
            body: content, // Map the 'content' from React into the 'body' of your Database schema
            author: req.user.id,
            image: req.file ? req.file.filename : ''
        });
        
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/posts/:id - Protected: Delete a post
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        
        // Only author or admin can delete
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        
        await post.deleteOne();
        res.json({ message: 'Post removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/posts/:id - Protected: Edit a post
// Assuming you have 'upload.single("image")' required at the top from multer
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Security Check: Only the author or an admin can edit
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        // Update fields if they were provided
        post.title = req.body.title || post.title;
        post.body = req.body.body || post.body;
        
        // If they uploaded a new image, update it
        if (req.file) {
            post.image = req.file.filename;
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
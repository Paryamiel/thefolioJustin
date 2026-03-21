// backend/models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide your email address'],
            trim: true,
            // This is a simple Regex pattern to make sure they type a real email format
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        message: {
            type: String,
            required: [true, 'Please provide a message'],
        },
        // Optional: A handy flag if you ever want to mark messages as "Read" or "Resolved" later
        isRead: {
            type: Boolean,
            default: false,
        }
    },
    {
        // This is crucial! It automatically creates the 'createdAt' timestamp 
        // that your Admin Dashboard uses to show when the message was sent.
        timestamps: true,
    }
);

module.exports = mongoose.model('Contact', contactSchema);
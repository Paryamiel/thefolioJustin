// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({ 
    name: { type: String, required: true, trim: true }, 
    email: { type: String, required: true, unique: true, lowercase: true }, 
    password: { type: String, required: true, minlength: 6 }, 
    role: { type: String, enum: ['member', 'admin'], default: 'member' }, 
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }, 
    bio: { type: String, default: '' }, 
    profilePic: { type: String, default: '' }, // stores the image filename
}, { timestamps: true });

// Hash the password before saving to the database
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
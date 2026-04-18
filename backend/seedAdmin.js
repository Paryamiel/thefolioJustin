require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

connectDB().then(async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@thefolio.com';
        const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const adminName = process.env.ADMIN_NAME || 'TheFolio Admin';
        
        const exists = await User.findOne({ email: adminEmail });
        if (exists) {
            console.log('Admin account already exists.');
            process.exit();
        }
        
        await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPass,
            role: 'admin'
        });
        
        console.log('Admin account created successfully!');
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
});
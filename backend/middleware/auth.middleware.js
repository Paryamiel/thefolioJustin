// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if the authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token (e.g., "Bearer eyJhbGci...")
            token = req.headers.authorization.split(' ')[1];

            // Verify token using the secret key from your .env file
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded user data (like user ID and role) to the request
            req.user = decoded;
            
            // Move on to the next function
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
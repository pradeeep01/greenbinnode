const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ 
                    message: `User role ${user.role} is not authorized to access this route`
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
}; 
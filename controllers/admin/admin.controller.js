const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const Bin = require('../../models/Bin');
const Vehicle = require('../../models/Vehicle');

exports.getDashboardData = async (req, res) => {
    try {
        // Get total users count
        const totalUsers = await User.countDocuments();
        
        // Get active users (those who logged in within last 30 days)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const activeUsers = await User.countDocuments({
            lastLoginDate: { $gte: thirtyDaysAgo }
        });

        // Get admin users count
        const adminUsers = await User.countDocuments({ role: 'admin' });

        // Get recent users
        const recentUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get total bins count
        const totalBins = await Bin.countDocuments();

        // Get total vehicles count
        const totalVehicles = await Vehicle.countDocuments();

        res.json({
            totalUsers,
            activeUsers,
            adminUsers,
            recentUsers,
            totalBins,
            totalVehicles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId, name, role } = req.body;
        
        console.log('Update user request:', { userId, name, role }); // Debug log

        // Validate role enum
        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role value. Must be "user" or "admin"' });
        }

        // Use req.params.id instead of userId from body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, role },
            { new: true, runValidators: true } // Return updated doc and run schema validations
        );

        if (!user) {
            return res.status(404).json({ message: `User not found with ID: ${req.params.id}` });
        }

        res.json({ message: `User updated successfully ID: ${req.params.id}`, user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    console.log(req.params.id);
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        // Save user to database
        await newUser.save();

        // Return success without exposing password
        const userResponse = {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        };

        res.status(201).json({ 
            success: true,
            message: 'User created successfully', 
            user: userResponse 
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error creating user'
        });
    }
};

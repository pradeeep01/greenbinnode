const User = require('../../models/User');
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

        res.json({
            totalUsers,
            activeUsers,
            adminUsers,
            recentUsers
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
        const { name, email, role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 
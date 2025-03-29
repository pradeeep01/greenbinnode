const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Admin routes with authentication and authorization
router.get('/users', protect, authorize('admin'), adminController.getAllUsers);
router.get('/users/:id', protect, authorize('admin'), adminController.getUserById);
router.put('/users/:id', protect, authorize('admin'), adminController.updateUser);
router.delete('/users/:id', protect, authorize('admin'), adminController.deleteUser);

// Admin panel views
router.get('/dashboard', protect, authorize('admin'), (req, res) => {
    res.render('admin/dashboard');
});

router.get('/users', protect, authorize('admin'), (req, res) => {
    res.render('admin/users');
});

module.exports = router; 
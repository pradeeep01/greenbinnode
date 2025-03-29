const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin.controller');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/webauth.middleware');

// Admin panel views
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('admin/dashboard');
});
router.get('/dashboard/insights', ensureAuthenticated, adminController.getDashboardData);

router.get('/users', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/users');
});

// API routes for users (requires authentication & admin role)
router.get('/users/list', ensureAuthenticated, ensureAdmin, adminController.getAllUsers);
router.get('/users/:id', ensureAuthenticated, ensureAdmin, adminController.getUserById);
router.put('/users/:id', ensureAuthenticated, ensureAdmin, adminController.updateUser);
router.delete('/users/:id', ensureAuthenticated, ensureAdmin, adminController.deleteUser);

module.exports = router;

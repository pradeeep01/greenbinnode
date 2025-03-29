const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin/admin.controller');
const contactusController = require('../controllers/admin/contactus.controller');
const { ensureAuthenticated, ensureAdmin } = require('../middleware/webauth.middleware');
const vehicleController = require('../controllers/admin/vehicle.controller');

// Admin panel views
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('admin/dashboard');
});
router.get('/dashboard/insights', ensureAuthenticated, adminController.getDashboardData);

router.get('/users', ensureAuthenticated, ensureAdmin, (req, res) => {
    res.render('admin/users');
});

// API routes for users (requires authentication & admin role)
router.post('/users', ensureAuthenticated, ensureAdmin, adminController.addUser);
router.get('/users/list', ensureAuthenticated, ensureAdmin, adminController.getAllUsers);
router.get('/users/:id', ensureAuthenticated, ensureAdmin, adminController.getUserById);
router.put('/users/:id', ensureAuthenticated, ensureAdmin, adminController.updateUser);
router.delete('/users/:id', ensureAuthenticated, ensureAdmin, adminController.deleteUser);

router.get('/contactus', ensureAuthenticated, ensureAdmin, contactusController.getContactUs);
router.delete('/contactus/:id', ensureAuthenticated, ensureAdmin, contactusController.deleteContact);

// Vehicle routes
router.get('/vehicle', ensureAuthenticated, (req, res) => {
    res.render('admin/vehicle');
});
router.post('/vehicles', ensureAuthenticated, ensureAdmin, vehicleController.createVehicle);
router.get('/allvehicles', ensureAuthenticated, vehicleController.getAllVehicles);
router.get('/vehicles/:id', ensureAuthenticated, vehicleController.getVehicleById);
router.put('/vehicles/:id', ensureAuthenticated, ensureAdmin, vehicleController.updateVehicle);
router.delete('/vehicles/:id', ensureAuthenticated, ensureAdmin, vehicleController.deleteVehicle);

module.exports = router;

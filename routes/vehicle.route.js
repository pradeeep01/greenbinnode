const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const vehicleController = require('../controllers/vehicle.controller');
// Public routes
router.get('/', vehicleController.getAll);

module.exports = router; 
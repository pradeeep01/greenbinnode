const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes
router.post('/', contactController.store);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), contactController.getAll);
router.get('/:id', protect, authorize('admin'), contactController.getById);
router.patch('/:id/status', protect, authorize('admin'), contactController.updateStatus);

module.exports = router; 
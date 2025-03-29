const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const binController = require('../controllers/bin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads/bins/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Public routes
router.get('/', binController.getAllBins);
router.get('/:id', binController.getBinById);

// Protected routes
router.post('/', protect, upload.single('image'), binController.createBin);
router.put('/:id', protect, upload.single('image'), binController.updateBin);
router.delete('/:id', protect, authorize('admin'), binController.deleteBin);
router.patch('/:id/status', protect, authorize('admin'), binController.updateBinStatus);

module.exports = router; 
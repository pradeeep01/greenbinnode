const Bin = require('../models/Bin');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../public/uploads/bins');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

exports.createBin = async (req, res) => {
    try {
        const { latitude, longitude, type } = req.body;
        
        // Handle image upload
        let imagePath = null;
        if (req.file) {
            imagePath = `/uploads/bins/${req.file.filename}`;
        }
        console.log(req.body)
        console.log(imagePath)

        const bin = new Bin({
            addedBy: req.user.userId, // From auth middleware
            latitude,
            longitude,
            type,
            image: imagePath
        });

        await bin.save();

        res.status(201).json({
            success: true,
            message: 'Bin created successfully',
            data: bin
        });
    } catch (error) {
        console.error('Error creating bin:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating bin',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.getAllBins = async (req, res) => {
    try {
        const bins = await Bin.find()
            .populate('addedBy', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bins.length,
            data: bins
        });
    } catch (error) {
        console.error('Error fetching bins:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bins',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.getBinById = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id)
            .populate('addedBy', 'name email');

        if (!bin) {
            return res.status(404).json({
                success: false,
                message: 'Bin not found'
            });
        }

        res.status(200).json({
            success: true,
            data: bin
        });
    } catch (error) {
        console.error('Error fetching bin:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching bin',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.updateBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);

        if (!bin) {
            return res.status(404).json({
                success: false,
                message: 'Bin not found'
            });
        }

        // Handle image upload
        if (req.file) {
            // Delete old image if exists
            if (bin.image) {
                const oldImagePath = path.join(__dirname, '../public', bin.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            req.body.image = `/uploads/bins/${req.file.filename}`;
        }

        // Update bin
        const updatedBin = await Bin.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
         .populate('addedBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Bin updated successfully',
            data: updatedBin
        });
    } catch (error) {
        console.error('Error updating bin:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating bin',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.deleteBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);

        if (!bin) {
            return res.status(404).json({
                success: false,
                message: 'Bin not found'
            });
        }

        // Delete image if exists
        if (bin.image) {
            const imagePath = path.join(__dirname, '../public', bin.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await bin.remove();

        res.status(200).json({
            success: true,
            message: 'Bin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting bin:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting bin',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.updateBinStatus = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);

        if (!bin) {
            return res.status(404).json({
                success: false,
                message: 'Bin not found'
            });
        }

        const { isVerified } = req.body;
        if (isVerified !== 0 && isVerified !== 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification status'
            });
        }

        bin.isVerified = isVerified;
        await bin.save();

        res.status(200).json({
            success: true,
            message: 'Bin status updated successfully',
            data: bin
        });
    } catch (error) {
        console.error('Error updating bin status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating bin status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}; 
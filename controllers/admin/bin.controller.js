const Bin = require('../../models/Bin');

// Get all bins
exports.getAllBins = async (req, res) => {
    try {
        const bins = await Bin.find()
            .populate('vehicleId', 'vehicle_num')
            .populate('addedBy', 'name');
        res.json(bins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get bin by ID
exports.getBinById = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id)
            .populate('vehicleId', 'vehicle_num')
            .populate('addedBy', 'name');
        
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.json(bin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify bin
exports.verifyBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        // Add verification logic here if needed
        // For example, you could add a verified field to your schema
        // bin.verified = true;
        await bin.save();

        res.json({ message: 'Bin verified successfully', bin });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete bin
exports.deleteBin = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        await Bin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

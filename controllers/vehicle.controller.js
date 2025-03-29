const Bin = require('../models/Bin');
const path = require('path');
const fs = require('fs');
const Vehicle = require('../models/Vehicle');



exports.getAll = async (req, res) => {
    try {
        const bins = await Vehicle.find()
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
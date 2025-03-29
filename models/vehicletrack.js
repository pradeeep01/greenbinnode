const mongoose = require('mongoose');

const vehicleLocationSchema = new mongoose.Schema({
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

const VehicleLocation = mongoose.model('VehicleLocation', vehicleLocationSchema);
module.exports = VehicleLocation;
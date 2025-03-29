const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    vehicle_num: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    driver_name: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    tracking: { type: Boolean, default: false } // ✅ Toggle Tracking
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Index for faster queries
vehicleSchema.index({ vehicle_num: 1 });
vehicleSchema.index({ status: 1 });

// Pre-save middleware to ensure vehicle_num is uppercase
vehicleSchema.pre('save', function(next) {
    if (this.isModified('vehicle_num')) {
        this.vehicle_num = this.vehicle_num.toUpperCase();
    }
    next();
});

// Method to update vehicle status
vehicleSchema.methods.updateStatus = async function(newStatus) {
    if (!['active', 'inactive'].includes(newStatus)) {
        throw new Error('Invalid status');
    }
    this.status = newStatus;
    return this.save();
};

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle; 
const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: false,
        trim: true
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180
    },
    isVerified: {
        type: Number,
        enum: [0, 1],
        default: 0
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Indexes for faster queries
binSchema.index({ vehicleId: 1 });
binSchema.index({ addedBy: 1 });
binSchema.index({ latitude: 1, longitude: 1 }); // Geospatial index
binSchema.index({ isVerified: 1 }); // Index for verification status

// Pre-save middleware to validate coordinates
binSchema.pre('save', function(next) {
    if (this.isModified('latitude') || this.isModified('longitude')) {
        if (this.latitude < -90 || this.latitude > 90) {
            throw new Error('Invalid latitude value');
        }
        if (this.longitude < -180 || this.longitude > 180) {
            throw new Error('Invalid longitude value');
        }
    }
    next();
});

// Method to update location
binSchema.methods.updateLocation = async function(latitude, longitude) {
    if (latitude < -90 || latitude > 90) {
        throw new Error('Invalid latitude value');
    }
    if (longitude < -180 || longitude > 180) {
        throw new Error('Invalid longitude value');
    }
    this.latitude = latitude;
    this.longitude = longitude;
    return this.save();
};

// Method to update image
binSchema.methods.updateImage = async function(imageUrl) {
    this.image = imageUrl;
    return this.save();
};

// Method to verify bin
binSchema.methods.verify = async function() {
    this.isVerified = 1;
    return this.save();
};

// Method to unverify bin
binSchema.methods.unverify = async function() {
    this.isVerified = 0;
    return this.save();
};

const Bin = mongoose.model('Bin', binSchema);

module.exports = Bin; 
const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [3, 'Name must be at least 3 characters long']
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Description must be at least 10 characters long']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: false,
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
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Indexes for faster queries
productSchema.index({ slug: 1 });
productSchema.index({ status: 1 });
productSchema.index({ addedBy: 1 });
productSchema.index({ price: 1 });

// Pre-save middleware to generate slug from name
productSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
            trim: true
        });
    }
    next();
});

// Method to update product status
productSchema.methods.updateStatus = async function(newStatus) {
    if (!['active', 'inactive'].includes(newStatus)) {
        throw new Error('Invalid status');
    }
    this.status = newStatus;
    return this.save();
};

// Method to update product price
productSchema.methods.updatePrice = async function(newPrice) {
    if (newPrice < 0) {
        throw new Error('Price cannot be negative');
    }
    this.price = newPrice;
    return this.save();
};

// Method to update product image
productSchema.methods.updateImage = async function(imageUrl) {
    this.image = imageUrl;
    return this.save();
};

// Static method to get active products
productSchema.statics.getActiveProducts = async function() {
    return this.find({ status: 'active' });
};

// Static method to get products by price range
productSchema.statics.getProductsByPriceRange = async function(minPrice, maxPrice) {
    return this.find({
        status: 'active',
        price: {
            $gte: minPrice,
            $lte: maxPrice
        }
    });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 
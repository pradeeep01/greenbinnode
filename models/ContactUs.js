const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, 'Subject must be at least 5 characters long']
    },
    message: {
        type: String,
        required: true,
        trim: true,
        minlength: [10, 'Message must be at least 10 characters long']
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied'],
        default: 'new'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps
});

// Indexes for faster queries
contactUsSchema.index({ email: 1 });
contactUsSchema.index({ status: 1 });
contactUsSchema.index({ createdAt: -1 });

// Method to mark message as read
contactUsSchema.methods.markAsRead = async function() {
    this.status = 'read';
    return this.save();
};

// Method to mark message as replied
contactUsSchema.methods.markAsReplied = async function() {
    this.status = 'replied';
    return this.save();
};

// Static method to get unread messages count
contactUsSchema.statics.getUnreadCount = async function() {
    return this.countDocuments({ status: 'new' });
};

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs; 
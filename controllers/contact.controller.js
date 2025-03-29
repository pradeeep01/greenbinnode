const ContactUs = require('../models/ContactUs');

exports.store = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Create new contact message
        const contactMessage = new ContactUs({
            name,
            email,
            subject,
            message
        });

        // Save the message
        await contactMessage.save();

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: contactMessage
        });
    } catch (error) {
        console.error('Contact form error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation Error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error sending message',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.getAll = async (req, res) => {
    try {
        const messages = await ContactUs.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching messages',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.getById = async (req, res) => {
    try {
        const message = await ContactUs.findById(req.params.id);
        
        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: message
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching message',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await ContactUs.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        message.status = status;
        await message.save();

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: message
        });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
}; 
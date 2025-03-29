const ContactUs = require('../../models/ContactUs');

exports.getContactUs = async (req, res) => {
    try {
        const contactUs = await ContactUs.find();

        res.render('admin/contactus', { contactUs });
    } catch (error) {
        console.error('Error fetching contact us:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteContact = async (req, res) => {
    try {
        await ContactUs.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
    
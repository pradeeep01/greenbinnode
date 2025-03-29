const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/webauth.controller');

const loginValidation = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];
router.get('/login', (req, res) => {
    res.render('login', {
        error: req.flash('error')
    });
});

router.post('/login', loginValidation, authController.login);
router.get('/logout', authController.logout);
module.exports = router; 
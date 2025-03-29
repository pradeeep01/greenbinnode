const passport = require('passport');
const { validationResult } = require('express-validator');
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.redirect('/');
        }
        res.redirect('/login');
    });
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect('/login');
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            req.flash('error', 'An error occurred during login');
            return res.redirect('/web/login');
        }

        if (!user) {
            req.flash('error', info.message || 'Invalid credentials');
            return res.redirect('/web/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                req.flash('error', 'An error occurred during login');
                return res.redirect('/web/login');
            }

            // Redirect based on user role
            if (user.role === 'admin') {
                return res.redirect('/admin/dashboard');
            }
            return res.redirect('/');
        });
    })(req, res, next);
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/login');
};

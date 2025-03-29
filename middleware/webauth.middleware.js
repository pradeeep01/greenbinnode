module.exports = {
    ensureAuthenticated: (req, res, next) => {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error', 'Please log in to access this page');
      res.redirect('/web/login');
    },
  
    ensureAdmin: (req, res, next) => {
      if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
      }
      req.flash('error', 'You are not authorized to access this page');
      res.redirect('/');
    }
  };
  
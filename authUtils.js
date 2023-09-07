module.exports.ensureAuthenticated = (req, res, next) => {
    console.log('ensureAuthenticated middleware called');
    if (req.isAuthenticated()) {
        console.log("Authentication Success");
        return next();
    }
    res.redirect('/sign-in/login');
};
// middleware function to check for logged-in users
var sessionChecker = require('./sessionChequer');

module.exports = (app) => {

    app.get('/', sessionChecker, (req, res) => {
    
        res.redirect('/login');
    });
}
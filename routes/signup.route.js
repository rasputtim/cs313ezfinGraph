//////////////////   Database init
const db = require('../config/db.config.js');
const User = db.tusuario;
// middleware function to check for logged-in users
var sessionChecker = require('./sessionChequer');
// route for user signup
//this route is not used anymore
module.exports = (app) => {
app.route('/signup')
    .get(sessionChecker, (req, res) => {
        res.render('signup');
    })
    .post((req, res) => {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(user => {
            req.session.user = user.dataValues;
            res.redirect('/dashboard');
        })
        .catch(error => {
            res.redirect('/signup');
        });
    });
}
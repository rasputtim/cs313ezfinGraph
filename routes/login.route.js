//////////////////   Database init
const db = require('../config/db.config.js');
const User = db.tusuario;
// middleware function to check for logged-in users
var sessionChecker = require('./sessionChequer');

module.exports = (app) => {

    app.route('/login')
    .get(sessionChecker, (req, res) => {
        //controller
        var index1 = '';
        var index2 = '';
        var index3 = '';
        var index4 = 'active';
        var index5 = '';
        res.render('login',{ user:  req.session.user, loggedin:false , index1_active: index1, index2_active: index2, index3_active: index3 ,index4_active: index4,index5_active: index5} );
    })
    .post((req, res) => {
        var username = req.body.username,
            password = req.body.password;

        User.findOne({ where: { id_usuario: username } }).then(function (user) {
            if (!user) {
                console.log("DID NOT FIND ANY USER");
                res.redirect('/login');
            } else if (!user.validPassword(password)) {
                console.log("NOT A VALID PASSWORD");
                res.redirect('/login');
            } else {
                req.session.user = user.dataValues;
                res.redirect('/home');
            }
        });
    });
}
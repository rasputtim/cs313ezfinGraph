//////////////////   Database init
const db = require('../config/db.config.js');
const User = db.tusuario;
// middleware function to check for logged-in users
var sessionChecker = require('./sessionChequer');

module.exports = (app) => {

    app.route('/login')
    .get(sessionChecker, (req, res) => {
        //controller
              
        res.render('login',{ user:  req.session.user, loggedin:false , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
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
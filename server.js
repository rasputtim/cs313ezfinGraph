var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var async = require('async');
///////  DATABASE SETUP ////////


//////////////////   Database init
const db = require('./config/db.config.js');
const User = db.tusuario;

// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
    console.log('Drop and Resync with { force: false }');
  }).catch(error => console.log('This error occured', error));


///////////////////////////////
var PORT = process.env.PORT || 8000;
// invoke an instance of express application.
var app = express();


// set our application port
app.set('port', PORT);

//the public_html folder
app.use(express.static("public"));
// set the view engine to ejs
app.set('views', 'views'); //folder to look for the ejs templetes
app.set('view engine', 'ejs');

// set morgan to log info about our requests for development use.
app.use(morgan('dev'));

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));


// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});


// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/dashboard');
    } else {
        next();
    }    
};


/////// ASYNC PARALLELLL

// ROUTES //////////////////////
//NORMAL PAGES /////////////////
require('./routes/logout.route')(app);
require('./routes/home')(app);
///////////////////PAGES THAT CALL AJAX////////////////////////////
require('./routes/inctrans.route')(app);
require('./routes/spendbycat.route')(app);
require('./routes/cashflow.route')(app);
///////AJAX ////////////////////////////
require('./routes/getgraphdata.route')(app);
require('./routes/getgraphcashflow.route')(app);

app.get('/', sessionChecker, (req, res) => {
    
    res.redirect('/login');
});

// route for user Login 
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



// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));


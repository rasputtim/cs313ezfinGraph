var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var async = require('async');
///////  DATABASE SETUP ////////


//////////////////   Database init
const db = require('./config/db.config.js');

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

// midleware to initialize express-session to allow us track the logged-in user across sessions.
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
var checkCookie = require('./routes/checkCookie');


////////////////////////////////
// ROUTES //////////////////////
////////////////////////////////

app.use(checkCookie);

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
require('./routes/root.route')(app);
// route for user Login 
require('./routes/login.route')(app);
require('./routes/signup.route')(app);


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));


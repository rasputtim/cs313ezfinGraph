var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var async = require('async');
///////  DATABASE SETUP ////////

//var User = require('./models/user');
//////////////////   Database init
const db = require('./config/db.config.js');

const Category = db.category;
const User = db.tusuario;
const Transaction = db.transactions;
const Balview = db.balview;
// force: true will drop the table if it already exists
db.sequelize.sync({force: false}).then(() => {
    console.log('Drop and Resync with { force: false }');
    console.log('users table has been successfully created, if one doesn\'t exist');
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

//var index = require('./routes/index');
//app.use('/', index);
// route for Home-Page
app.get('/', sessionChecker, (req, res) => {
    res.redirect('/login');
});



// route for user signup
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


// route for user Login
app.route('/login')
    .get(sessionChecker, (req, res) => {
        //controller
        var name = "Salvatore";
        var emailaddress = "meuemail@teste.com";

        //var params = {username: name , email: emailaddress, graph: graphHTML};
        //view
        //res.render('login',params);
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


// route for user's dashboard
app.get('/dashboard', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.render('dashboard');
    } else {
        res.redirect('/login');
    }
});


//var inctrans = require('./routes/inctrans');
//app.use('/inctrans', inctrans);



/////// ASYNC PARALLELLL
var stackfunctions = {
    categories: function(callback) { 
                Category.findAll().then(function(categoryResult){
                    //console.log("categories result: " + JSON.stringify(categoryResult));
                    var err = null;
                    callback(err, categoryResult);
                });
            }, 
    balviews: function(callback){
            Balview.findAll().then(function(balviewResult){
            //console.log("Periods result: " + JSON.stringify(balviewResult));
            var err = null;
            callback(err, balviewResult);
        });
    }
};





////////////////////



const catlist = require('./controller/category.controller.js');
// All this objects are exported n the ./controller/index.js file
const catlistController = require('./controller').category_controller;
const userController = require('./controller').user_controller;
const transactionController = require('./controller').transaction_controller;
const balviewController = require('./controller').balview_controller;


app.get('/inctrans', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       

    // Retrieve all Customer
    var cats;     ///This way is working ///////////////
    async.parallel( stackfunctions, function(err,result){
        var cats = result.categories;
        var views = result.balviews;
        //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
        //console.log("\n==============================================\n");
        //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
        res.render('inctrans',{periods: views, cats:cats , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    
    });
    
    ///todo: shall work in the module as well with callback. how?
    /*Category.findAll().then(function (catgories) {
        cats = JSON.stringify(catgories);
        for (let i = 0; i < catgories.length; i++)  {
            console.log(catgories[i].dataValues.name);
          }
        res.render('inctrans',{cats:catgories , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    });
    */
    
    //console.log(req.cats);
    //////////////  CALLBACK MODE WITH MODULE RETIEVEL////////////
    //var categories;
    //catlist.findAll(req,function(data, index) {
    //    console.log(data);
    //  });
    //categories.forEach(function(data, index) {
     //   console.log(data);
     // });
     ////////////////////////////////

        
    } else {
        res.redirect('/login');
    }
});

app.get('/spendbycat', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       
    // Retrieve all Customer
    var cats;     ///This way is working ///////////////
    async.parallel( stackfunctions, function(err,result){
        var cats = result.categories;
        var views = result.balviews;
        //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
        //console.log("\n==============================================\n");
        //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
        res.render('spendbycat',{periods: views, cats:cats , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    
    });
    
    ///todo: shall work in the module as well with callback. how?
    /*Category.findAll().then(function (catgories) {
        cats = JSON.stringify(catgories);
        for (let i = 0; i < catgories.length; i++)  {
            console.log(catgories[i].dataValues.name);
          }
        res.render('inctrans',{cats:catgories , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    });
    */
    
    //console.log(req.cats);
    //////////////  CALLBACK MODE WITH MODULE RETIEVEL////////////
    //var categories;
    //catlist.findAll(req,function(data, index) {
    //    console.log(data);
    //  });
    //categories.forEach(function(data, index) {
     //   console.log(data);
     // });
     ////////////////////////////////

        
    } else {
        res.redirect('/login');
    }
});


app.get('/cashflow', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
       
    // Retrieve all Customer
    var cats;     ///This way is working ///////////////
    async.parallel( stackfunctions, function(err,result){
        var cats = result.categories;
        var views = result.balviews;
        //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
        //console.log("\n==============================================\n");
        //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
        res.render('cashflow',{periods: views, cats:cats , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    
    });
    
    ///todo: shall work in the module as well with callback. how?
    /*Category.findAll().then(function (catgories) {
        cats = JSON.stringify(catgories);
        for (let i = 0; i < catgories.length; i++)  {
            console.log(catgories[i].dataValues.name);
          }
        res.render('inctrans',{cats:catgories , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    });
    */
    
    //console.log(req.cats);
    //////////////  CALLBACK MODE WITH MODULE RETIEVEL////////////
    //var categories;
    //catlist.findAll(req,function(data, index) {
    //    console.log(data);
    //  });
    //categories.forEach(function(data, index) {
     //   console.log(data);
     // });
     ////////////////////////////////

        
    } else {
        res.redirect('/login');
    }
});



app.get('/form', (req, res) => {
    //if (req.session.user && req.cookies.user_sid) {
        res.render('form');
    //} else {
    //    res.redirect('/login');
    //}
});
///////////////////SEARCHING AJAX TESTING////////////////////////////
// second route
app.get('/searching', function(req, res){

	
    /* THIS IS WORKING AJAX WITH PARALLEL 
    async.parallel( stackfunctions, function(err,result){
        var cats = result.categories;
        var views = result.balviews;
        //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
        //console.log("\n==============================================\n");
        //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
        craig = JSON.stringify(views);
        console.log(craig);
        res.send(craig);
    });
    */
    Balview.findAll().then(function(balviewResult){
        //console.log("Periods result: " + JSON.stringify(balviewResult));
     //   var err = null;
        //results = req.body.query.results.RDF.item[0]['about'];
        craig = JSON.stringify(balviewResult);
        //console.log(craig);
        res.send(craig);
    });
	

});

// route for user Login
//require('./ponder09/routes')(app);

/////////////  END PONDER 09 ////////////////////


app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        Category.findAll().then(function(categoryResult){
            //console.log("categories result: " + JSON.stringify(categoryResult));
            craig = JSON.stringify(categoryResult);
            res.render('home',{ catsmost: craig , user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
        });
        /*
        $sql = 'SELECT       idcategory,
        COUNT(idcategory) AS value_occurrence 
   FROM     public.ezfin_transactions
   GROUP BY idcategory
   ORDER BY value_occurrence DESC
   LIMIT    8';
*/
       
    } else {
        res.redirect('/login');
    }
});



// route for user logout
app.get('/logout', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});


// route for handling 404 requests(unavailable routes)
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
});


 
require('./routes/customer.route.js')(app);  ///for findall
  





// start the express server
app.listen(app.get('port'), () => console.log(`App started on port ${app.get('port')}`));

/*

function initial() {
	Customer.create({
	   firstname: "Jack",
	   lastname: "Davis",
	   age: 25
        });
 
	Customer.create({
	   firstname: "Mary",
	   lastname: "Taylor",
	   age: 37
        });

	Customer.create({
	   firstname: "Peter",
	   lastname: "Smith",
	   age: 32
        });
}
*/
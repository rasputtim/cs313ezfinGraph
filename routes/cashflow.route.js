var async = require('async');

const db = require('../config/db.config.js');


const Category = db.category;
const User = db.tusuario;
const Transaction = db.transactions;
const Balview = db.balview;

const HTML = require("../libs/functions_html");

var stackfunctionsSearch = {
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
    
    },
    selectBalview: function(callback){
        var period = "";
        HTML.print_select_from_sql ('SELECT idBalView, title FROM public.ezfin_balanceView', 'period_select',
        period, '', "Periods", '', true, 0, false, '').then(function(selViews2){
            //console.log("Periods result: " + JSON.stringify(balviewResult));
            var err = null;
            callback(err, selViews2);
        });
        
    
    },
    selectCategory: function(callback){
        var period = "";
        var multiple = true;
        HTML.print_select_from_sql ('SELECT idCat, alias FROM public.ezfin_category', 'category_select',
        period, '', "Category", '', true, multiple, false, '').then(function(catViews){
            //console.log("Periods result: " + JSON.stringify(balviewResult));
            var err = null;
            callback(err, catViews);
        });
        
    
    }
};


module.exports = (app) => {

app.get('/cashflow', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {

      
    async.parallel( stackfunctionsSearch, function(err,result){
        var cats = result.categories;
        var views = result.balviews;
        var selCats = result.selectCategory;
        var selViews = result.selectBalview;
        var index1 = '';
        var index2 = 'active';
        var index3 = '';
        var index4 = '';
        var index5 = '';

        //console.log("PARALLEL RESULTS FOR CATEGORIES: " + JSON.stringify(cats));
        //console.log("\n==============================================\n");
        //console.log("PARALLEL RESULTS FOR VIEWS: " + JSON.stringify(views));
        //console.log("SELECT BY SQL: " + selCats);
        res.render('cashflow',{select_categories: selCats, select_views: selViews, periods: views, cats:cats , user:  req.session.user, loggedin:true , index1_active: index1, index2_active: index2, index3_active: index3 ,index4_active: index4,index5_active: index5} );
    
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

}
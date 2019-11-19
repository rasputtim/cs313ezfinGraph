var express = require('express');
var router = express.Router();

module.exports = (app) => {

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
    

}

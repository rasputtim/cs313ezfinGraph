var express = require('express');


/* GET users listing. */
const CatsMost = require("../controllers/catsmostused.controller.js");

module.exports = (app) => {
app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        
        var params = { user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false};
        CatsMost.getMostUsedCats(req, res, params);
      
    } else {
        res.redirect('/login');
    }
});

};

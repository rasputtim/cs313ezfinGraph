var express = require('express');


/* GET users listing. */
const CatsMost = require("../controllers/catsmostused.controller.js");

module.exports = (app) => {
app.get('/home', (req, res) => {
    if (req.session.user && req.cookies.user_sid) {
        var index1 = '';
        var index2 = '';
        var index3 = 'active';
        var index4 = '';
        var index5 = '';
        var params = { user:  req.session.user, loggedin:true , index1_active: index1, index2_active: index2, index3_active: index3 ,index4_active: index4,index5_active: index5};
        CatsMost.getMostUsedCats(req, res, params);
      
    } else {
        res.redirect('/login');
    }
});

};

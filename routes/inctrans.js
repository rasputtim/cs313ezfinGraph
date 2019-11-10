var express = require('express');
var router = express.Router();

/* GET inctrans page. */

router.get('/inctrans', (req, res) => {
    res.redirect('/login');
    if (req.session.user && req.cookies.user_sid) {
        
        res.render('inctrans',{user:  req.session.user, loggedin:true , index1_active:false, index2_active:false, index3_active:false ,index4_active:false,index4_active:false} );
    } else {
        res.redirect('/login');
    }
});

module.exports = router;


const rates = require('../rates.js');

module.exports = (app) => {
app.route('/ponder09')
    .get((req, res) => {
        
        res.render('ponder09/form');
        
    })
    .post((req, res) => {
        var weight = req.body.weight,
        thetype = req.body.thetype;

        var value = rates.calculateRate(weight,thetype);
        console.log("The value : " + value);
        res.render('ponder09/home',{weight: weight , type: thetype , price: value} );
    });
};

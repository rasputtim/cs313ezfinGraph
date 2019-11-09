module.exports = function(app) { 
    const customers = require('../controller/transaction.controller.js');

    // Retrieve all Customer
    app.get('/api/customers', customers.findAll);
}
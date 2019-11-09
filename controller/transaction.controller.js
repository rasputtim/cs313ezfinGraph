const db = require('../config/db.config.js');
const Transaction = db.transaction;
 
// FETCH all transactions
exports.findAll = (req, res) => {
	Transaction.findAll().then(transactions => {
	  // Send all transactions to Client
	  res.send(transactions);
	});
};

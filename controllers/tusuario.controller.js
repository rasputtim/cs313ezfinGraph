const db = require('../config/db.config.js');
const User = db.tusuario;
 
// FETCH all Customers
exports.findAll = (req, res) => {
	User.findAll().then(users => {
	  // Send all customers to Client
	  res.send(users);
	});
};


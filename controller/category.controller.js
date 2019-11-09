const db = require('../config/db.config.js');
const Category = db.category;
 
// FETCH all Categorys
exports.findAll = (req, res) => {
	Category.findAll().then(categorys => {
	  // Send all Categorys to Client
	  res.send(categorys);
	});
};

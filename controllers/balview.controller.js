const db = require('../config/db.config.js');
const Balview = db.balview;
 
// FETCH all Balviews
exports.findAll = (req, res) => {
	Balview.findAll().then(balviews => {
	  // Send all Balviews to Client
	  res.send(balviews);
	});
};

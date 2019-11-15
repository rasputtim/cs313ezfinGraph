const db = require('../config/db.config.js');
const Category = db.category;
 
// FETCH all Categorys
/*
This function is designed to be a route handler for whichever Express route we'll choose to attach it to.
The req parameter is the incoming request from the client. 
The res parameter is the response we're preparing to eventually send back to the client 
in response to their request :). 
All Express route handlers follow this method signature. We can have a third parameter, conventionally named next, which is a function that passes the request on to the next route handler (meaning that a route can be handled by multiple route handlers, in which case it's piped or passed along all of those route handlers).
*/
//exports.findAll = (req, res) => {
//	Category.findAll().then(categorys => {
//	  // Send all Categorys to Client
//	  res.send(categorys);
//	});
//};
module.exports = {
	findAll(req, res) {
	  return Category
		.findAll()
		.then(category => res.status(201).send(category))
		.catch(error => res.status(400).send(error));
	},
  };
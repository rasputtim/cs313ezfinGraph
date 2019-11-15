/*
where we're going to be exporting our controllers from. 
I find this helpful since it helps me consolidate my 
imports (require statements) from once central place.
*/
const category_controller = require('./category.controller.js');
const user_controller = require('./tusuario.controller.js');
const transaction_controller = require('./transaction.controller.js');
const balview_controller = require('./balview.controller.js');

 
module.exports = {
	category_controller,
	user_controller,
	transaction_controller,
	balview_controller
  };
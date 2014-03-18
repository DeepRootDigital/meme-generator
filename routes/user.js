var bcrypt = require('bcrypt');


/*
 * GET users listing.
 */

 exports.list = function(db){
 	return function(req, res) {
 		db.collection('userlist').find().toArray(function(err, items) {
 			res.json(items);
 		});
 	}
 };

/*
 * POST to register users
 */	

 exports.register = function(db) {
 	return function(req, res) {
 		db.collection('userlist').insert(req.body, function(err, result){
 			res.send(
 				(err === null) ? { msg: ''} : { msg: err }
 				);
 		});
 	}
 } 
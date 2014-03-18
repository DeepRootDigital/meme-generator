
/*
 * GET memes listing.
 */

exports.bglist = function(db) {
  return function(req, res) {
  	db.collection('bglist').find().toArray(function(err, items) {
      res.json(items);
  	});
  }
};

/*
 * POST to addmeme
 */

 exports.addbg = function(db) {
   return function(req, res) {
     db.collection('bglist').insert(req.body, function(err, result){
       res.send(
         (err === null) ? { msg: ''} : { msg: err }
       );
     });
   }
 };

/*
 * DELETE to deletememe
 */

 exports.deletebg = function(db) {
   return function(req, res) {
     var bgToDelete = req.params.id;
     db.collection('bglist').removeById(bgToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 };
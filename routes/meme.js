
/*
 * GET memes listing.
 */

exports.memelist = function(db) {
  return function(req, res) {
  	db.collection('memelist').find().toArray(function(err, items) {
      res.json(items);
  	});
  }
};

/*
 * POST to addmeme
 */

 exports.addmeme = function(db) {
   return function(req, res) {
     db.collection('memelist').insert(req.body, function(err, result){
       res.send(
         (err === null) ? { msg: ''} : { msg: err }
       );
     });
   }
 };

 exports.updateMeme = function(db) {
  return function(req, res) {
    var usern = req.body.username;
    var mmn = req.body.memename;
    db.collection('memelist').update({"username" : usern, "memename" : mmn }, req.body, function(err, result){
      res.send(
        (err === null) ? { msg: ''} : { msg: err }
      );
    });
  }
 }

/*
 * DELETE to deletememe
 */

 exports.deletememe = function(db) {
   return function(req, res) {
     var memeToDelete = req.body.id;
     db.collection('memelist').removeById(memeToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 };
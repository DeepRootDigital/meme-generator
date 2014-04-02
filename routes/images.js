var fs = require('fs');

/*
 * GET images listing.
 */

exports.imageList = function(db) {
  return function(req, res) {
    db.collection('imglist').find().toArray(function(err, items) {
      res.json(items);
    });
  }
};

exports.iconList = function(db) {
  return function(req, res) {
    db.collection('iconlist').find().toArray(function(err, items) {
      res.json(items);
    });
  }
};

/*
 * POST to upload image
 */

 exports.uploadFile = function(db) {
   return function(req, res) {
     var oldPath = req.files.file.path;
     var usern = req.headers.un;
     fs.readFile(oldPath, function (err, data) {
       var fileName = req.files.file.originalFilename;
       var savename = usern+"_"+fileName;
       var fileObj = {
        'filename' : fileName,
        'username' : usern,
        'savename' : savename
       }
       fs.rename(oldPath, 'public/bg/' + savename, function (err) {
        db.collection('imglist').insert(fileObj, function(err, result){
         res.redirect('back');
        });
       });
     });
   }
 };

 exports.uploadIcon = function(db) {
   return function(req, res) {
     var oldPath = req.files.file.path;
     var usern = req.headers.un;
     fs.readFile(oldPath, function (err, data) {
       var fileName = req.files.file.originalFilename;
       var savename = usern + "_" + fileName;
       var fileObj = {
        'filename' : fileName,
        'username' : usern,
        'savename' : savename
       }
       fs.rename(oldPath, 'public/icons/' + savename, function (err) {
        db.collection('iconlist').insert(fileObj, function(err, result){
          res.end();
        });
       });
     });
   }
 };

 exports.dzUpload = function(db) {
   return function(req, res) {
     var oldPath = req.files.file.path;
     var usern = req.headers.un;
     fs.readFile(oldPath, function (err, data) {
       var fileName = req.files.file.originalFilename;
       var fileObj = {
        'filename' : fileName,
        'username' : usern
       }
       fs.rename(oldPath, 'public/icons/' + fileName, function (err) {
        db.collection('iconlist').insert(fileObj, function(err, result){
          res.end();
        });
       });
     });
   }
 };

 /* POST to DELETE */

  exports.deleteimage = function(db) {
   return function(req, res) {
     var bgToDelete = req.body.id;
     db.collection('iconlist').removeById(bgToDelete, function(err, result) {
       res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
     });
   }
 };
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
     var oldPath = req.files.newImg.path;
     fs.readFile(oldPath, function (err, data) {
       var fileName = req.files.newImg.originalFilename;
       var fileObj = {
        'filename' : fileName
       }
       fs.rename(oldPath, 'public/bg/' + fileName, function (err) {
        db.collection('imglist').insert(fileObj, function(err, result){
         res.redirect('back');
        });
       });
     });
   }
 };

 exports.uploadIcon = function(db) {
   return function(req, res) {
     var oldPath = req.files.newIcon.path;
     fs.readFile(oldPath, function (err, data) {
       var fileName = req.files.newIcon.originalFilename;
       var fileObj = {
        'filename' : fileName
       }
       fs.rename(oldPath, 'public/icons/' + fileName, function (err) {
        db.collection('iconlist').insert(fileObj, function(err, result){
         res.redirect('back');
        });
       });
     });
   }
 };
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var meme = require('./routes/meme');
var admin = require('./routes/admin');
var bg = require('./routes/bg');
var images = require('./routes/images');
var http = require('http');
var path = require('path');
var fs = require('fs');

// Database

var mongo = require('mongoskin');
// var db = mongo.db("mongodb://colpan:yoshi1@novus.modulusmongo.net:27017/aTevyb7y", {native_parser:true});
var db = mongo.db("mongodb://localhost:27017/memeappdev", {native_parser:true});

var app = express();

// all environments
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser({keepExtensions:true,uploadDir:__dirname+'/public/icons/tmp'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Define all the pages */

// Pre login
app.get('/', function(req, res) { res.render('frontpage.html'); });
app.get('/signup', function(req, res) { res.render('signup.html'); });
app.get('/login', function(req, res) { res.render('login.html'); });

// Post login
app.get('/home', function(req, res) { res.render('home.html'); });
app.get('/create', function(req, res) { res.render('creatememe.html'); });
app.get('/createtemplate', function(req, res) { res.render('templatememe.html'); });
app.get('/choose', function(req, res) { res.render('choose.html'); });
app.get('/manage', function(req, res) { res.render('user/managememe.html'); });
app.get('/templatecenter', function(req, res) { res.render('user/templatecenter.html'); });
app.get('/learn', function(req, res) { res.render('user/learn.html'); });
app.get('/support', function(req, res) { res.render('user/support.html'); });

// Misc Assets
app.get('/bg-upload', function(req, res) { res.render('bg-upload.html'); });
app.get('/icon-upload', function(req, res) { res.render('icon-upload.html'); });

// Admin Pages

app.get('/admin', function(req, res) { res.render('admin.html'); });

/* End Page Definitions */

/* Define RESTful actions */

// GET
app.get('/userlist', user.list(db));
app.get('/memelist', meme.memelist(db));
app.get('/bglist', bg.bglist(db));
app.get('/imagelist', images.imageList(db));
app.get('/iconlist', images.iconList(db));

// POST
app.post('/addmeme', meme.addmeme(db));
app.post('/bglist', bg.addbg(db));
app.post('/uploadimg', images.uploadFile(db));
app.post('/uploadicon', images.uploadIcon(db));
app.post('/dropzoneupload', images.dzUpload(db));
app.post('/register', user.register(db));
app.post('/deletememe', meme.deletememe(db));
app.post('/deletebg', bg.deletebg(db));

// Admin Actions

app.post('/updateuserlevel', admin.changeuser(db));
app.post('/adminlog', admin.adminlog(db));

/* End RESTful actions */
var port = process.env.PORT || 8080;
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + port);
});

//
app.listen(port);
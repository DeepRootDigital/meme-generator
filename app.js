/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var meme = require('./routes/meme');
var bg = require('./routes/bg');
var images = require('./routes/images');
var http = require('http');
var path = require('path');
var fs = require('fs');

// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/memeappfinal", {native_parser:true});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
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

app.get('/', function(req, res) { res.render('frontpage.html'); });
app.get('/home', function(req, res) { res.render('home.html'); });
app.get('/create', function(req, res) { res.render('creatememe.html'); });
app.get('/signup', function(req, res) { res.render('signup.html'); });
app.get('/login', function(req, res) { res.render('login.html'); });
app.get('/bg-upload', function(req, res) { res.render('bg-upload.html'); });
app.get('/icon-upload', function(req, res) { res.render('icon-upload.html'); });


/* End Page Definitions */

/* Define RESTful actions */

app.get('/userlist', user.list(db));
app.get('/memelist', meme.memelist(db));
app.get('/bglist', bg.bglist(db));
app.get('/imagelist', images.imageList(db));
app.get('/iconlist', images.iconList(db));
app.post('/addmeme', meme.addmeme(db));
app.post('/bglist', bg.addbg(db));
app.post('/uploadimg', images.uploadFile(db));
app.post('/uploadicon', images.uploadIcon(db));
app.post('/register', user.register(db));
app.delete('/deletememe/:id', meme.deletememe(db));
app.delete('/deletebg/:id', bg.deletebg(db));
/* End RESTful actions */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
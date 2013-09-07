
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

app.set('documentroot', '/tank/media/Pictures');
app.set('thumbnails', '.thumbs');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err, req, res, next) {
  var rel_path = req.params[0];
  var documentroot = req.app.get('documentroot');
  var abs_path = path.resolve(documentroot, rel_path);
  if (abs_path.substring(0,documentroot.length) != documentroot) {
    res.send(500, 'Attempt to traverse path with ' + rel_path);
  }
  else {
    req.app.set('abs_path', abs_path);
    next();
  }
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get(/^\/index\/(.*)/, routes.index);
app.get(/^\/image\/(.*)/, routes.image);
app.get(/^\/preview\/(.*)/, routes.preview);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

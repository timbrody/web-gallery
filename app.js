
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
app.set('previewroot', '.thumbs');

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

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var resolve_path = require('./gallery').resolve_path;

app.get(/^\/index\/(.*)/, resolve_path, routes.index);
app.get(/^\/image\/(.*)/, resolve_path, routes.image);
app.get(/^\/preview\/(.*)/, resolve_path, require('./thumbnail').generate, routes.preview);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


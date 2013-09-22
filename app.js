
/**
 * Module dependencies.
 */

var express = require('express')
  , fs = require('fs')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
;

var config = JSON.parse(fs.readFileSync(__dirname + "/config.json"));

var app = express();

if (!config.documentroot)
  throw new Error("'documentroot' missing or not defined");

app.set('documentroot', config.documentroot);
app.set('previewroot', config.previewroot || '.thumbs');

// all environments
app.set('port', config.port || process.env.PORT || 3000);
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

app.get('/', function(req, res) {
  res.redirect('/index/');
});
app.get(/^\/index\/(.*)/, resolve_path, routes.index);
app.get(/^\/image\/(.*)/, resolve_path, routes.image);
app.get(/^\/preview\/(.*)/, resolve_path, require('./thumbnail').generate, routes.preview);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// reload
process.on('SIGUSR1', function() {
});

// exit
process.once('SIGTERM', function() {
  server.on('close', function() {
    process.exit(0);
  }).close();
});

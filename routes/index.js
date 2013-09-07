
/*
 * GET home page.
 */

var fs = require('fs');
var mime = require('mime');
var path = require('path');

exports.index = function(req, res){
  var abs_path = req.abs_path;
  if (!fs.existsSync(abs_path)) {
    return res.send(404);
  }
  if (!fs.lstatSync(abs_path).isDirectory()) {
    return res.send(404);
  }
  fs.readdir(abs_path, function(err, names) {
    names = names.filter(function(fn) {
      return !fn.match(/^\./);
    });
    var dirs = names.filter(function(fn) {
      return fs.lstatSync(abs_path + '/' + fn).isDirectory();
    });
    var files = names.filter(function(fn) {
      return fs.lstatSync(abs_path + '/' + fn).isFile();
    });
    for(var i=0; i < dirs.length; ++i){
      var inames = fs.readdirSync(abs_path + '/' + dirs[i]);
      inames = inames.filter(function(fn) {
        return fs.lstatSync(abs_path + '/' + dirs[i] + '/' + fn).isFile();
      });
      dirs[i] = {
        name: dirs[i],
        contents: inames
      };
    }
    res.render('index', {
      title: 'Browse ' + req.params[0],
      rel_path: req.params[0],
      dirs: dirs,
      files: files
    });
  });
};


/*
 * GET image source
 */

exports.image = function(req, res){
  var abs_path = req.abs_path;
  if (!fs.lstatSync(abs_path).isFile()) {
    return res.send(404);
  }
  res.setHeader('Content-Type', mime.lookup(abs_path));
  res.setHeader('Content-Length', fs.lstatSync(abs_path).size);
  res.status(200).sendfile(abs_path);
};

exports.preview = function(req, res){
  var preview_abs_path = req.preview_abs_path;
  if (!preview_abs_path) {
    res.send(404);
    return;
  }
  res.setHeader('Content-Type', mime.lookup(preview_abs_path));
  res.setHeader('Content-Length', fs.lstatSync(preview_abs_path).size);
  res.status(200).sendfile(preview_abs_path);
};

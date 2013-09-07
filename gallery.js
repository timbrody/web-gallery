var path = require('path');
var fs = require('fs');
var mime = require('mime');

exports.resolve_path = function(req, res, next) {
  var rel_path = req.params[0];
  var documentroot = req.app.get('documentroot');
  var abs_path = path.resolve(documentroot, rel_path);

  // hmm, they're trying to traverse outside of our documentroot
  if (abs_path.substring(0,documentroot.length) != documentroot) {
    next('Attempt to traverse path with ' + rel_path);
  }
  else {
    req.abs_path = abs_path;
    next();
  }
};

exports.listImages = function(dir) {
  var names = fs.readdirSync(dir);
  names = names.filter(function(fn) {
    return !fn.match(/^\./);
  });
  names = names.filter(function(fn) {
    return fs.lstatSync(dir + path.sep + fn).isFile();
  });
  names = names.filter(function(fn) {
    var mime_type = mime.lookup(dir + path.sep + fn);
    return mime_type && mime_type.match(/^image\//);
  });
  return names;
};

exports.listFolders = function(dir) {
  var names = fs.readdirSync(dir);
  names = names.filter(function(fn) {
    return !fn.match(/^\./);
  });
  names = names.filter(function(fn) {
    return fs.lstatSync(dir + path.sep + fn).isDirectory();
  });
  return names;
};

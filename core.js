var path = require('path');
var fs = require('fs');

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

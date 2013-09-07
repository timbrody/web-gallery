
/*
 * GET home page.
 */

exports.index = function(req, res){
  var rel_path = req.params[0];
  var documentroot = req.app.get('documentroot');
  var path = path.resolve(documentroot, rel_path);
  if (path.substring(0,documentroot.length) != documentroot) {
    return res.send(500, 'Attempt to traverse path');
  }
  res.render('index', { title: 'Express' });
};

var fs = require('fs');
var path = require('path');

exports.generate = function(req, res, next){
  var src = req.abs_path;

  if (!fs.existsSync(src)) {
    next();
    return;
  }

  var src_stats = fs.lstatSync(src);
  if (!src_stats.isFile()) {
    next();
    return;
  }

  // calculate where the thumbnail would be
  var fn = path.basename(src);
  var dir = src.substring(0,src.length - fn.length);
  var previews_dir = path.resolve(dir, req.app.get('previewroot'));
  var tgt = previews_dir + path.sep + fn + '.jpg';

  // target already available
  if (fs.existsSync(tgt)) {
    var tgt_stats = fs.lstatSync(tgt);
    if (tgt_stats.mtime >= src_stats.mtime) {
      req.preview_abs_path = tgt;
      next();
      return;
    }
  }

  if (!fs.existsSync(previews_dir)) {
    fs.mkdirSync(previews_dir);
  }

  var args = [
    '-define',
    'jpeg:size=480x360',
    src,
    '-auto-orient',
    '-thumbnail',
    '180x180>',
    '-unsharp',
    '0x.5',
    tgt
  ];

  var spawn = require('child_process').spawn;
  var convert = spawn('convert', args);

  convert.stderr.on('data', function(data){
    console.log('convert stderr: ' + data);
  });

  convert.on('close', function (code) {
    if (code !== 0) {
      console.log('convert ' + args.join(' '));
    }
    req.preview_abs_path = tgt;
    next();
  });
};

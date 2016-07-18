
var fs = require('fs');
var uglifyjs = require('uglify-js');
var body = '';

['nab', 'string', 'array', 'element'].forEach(function(filename){
    body += fs.readFileSync(__dirname + '/src/' + filename + '.js', 'utf-8');
});

fs.writeFileSync(__dirname + '/nab.js', body, 'utf-8');
fs.writeFileSync(__dirname + '/nab-min.js', uglifyjs.minify(body, {fromString: true}).code, 'utf-8');

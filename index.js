#!/usr/bin/env node

var recast = require('recast');
var fs = require('fs');
var files = [];

for (var i = 2; i < process.argv.length; i++ ){
  files.push(process.argv[i]);
}

files.forEach(function(file) {
  var ast = recast.parse(fs.readFileSync(file));

  recast.visit(ast, {
    visitProperty: function(path) {
      if (path.node.value.type === 'FunctionExpression') {
        path.node.method = true;
      }
      this.traverse(path);
    }
  });

  fs.writeFileSync(file, recast.print(ast).code);
});

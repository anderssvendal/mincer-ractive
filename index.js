var ractive = require('ractive');

var prop = require('mincer/lib/mincer/common').prop;

module.exports = function addRactiveEngine(Mincer, rac) {

  var RactiveEngine = Mincer.RactiveEngine = function RactiveEngine(filename) {
    Mincer.Template.apply(this, arguments);
    rac = rac || Mincer.Template.libs.rac || require('ractive');
  };

  require('util').inherits(RactiveEngine, Mincer.Template);

  RactiveEngine.prototype.evaluate = function evaluate(context, locals) {
    var name = context.logicalPath;
    var compiled = JSON.stringify(rac.parse(this.data));
    var wrapped = '(function() {\n' +
      '  this.RactiveTemplates || (this.RactiveTemplates = {});\n' +
      '  this.RactiveTemplates[\'' + name + '\'] = ' + compiled + ';\n' +
      '  return this.RactiveTemplates[\'' + name + '\'];\n' +
      '}).call(this);\n';
    return wrapped;
  };

  Mincer.registerEngine('.rac', Mincer.RactiveEngine);
  prop(Mincer.RactiveEngine, 'defaultMimeType', 'application/javascript');

};

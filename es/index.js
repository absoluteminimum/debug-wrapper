import d from 'debug';

// bind to console
d.log = console.log.bind(console);

// @TODO:
// could remap console.log for `app:default` to easily disable
// only problem is binding d.log to it...
// console.log =

// wrapping debugjs to pass color as cb
var debug = function debug(namespace, color) {
  var debugjs = d(namespace);

  if (color) debugjs.color = color;

  // last param is color
  var colorCb = function colorCb() {
    var last = arguments[arguments.length - 1];
    // can't do debugjs.color because that is for that same ns...
    // debugjs.color = last.replace('c:', '')
    if (last.includes('c:')) {
      last = last.replace('c:', '');
      for (var i = 0; i < arguments.length; i++) {
        arguments[i] = '%c' + arguments[i];
      }
      arguments[arguments.length - 1] = 'color:' + last + ';';
    }
    debugjs.apply(debugjs, arguments);
  };

  // @TODO: do something cool with colors like debug.deeppink('canada')
  var proxy = new Proxy(colorCb, {
    get: function get(target, name) {
      return function wrapper() {
        console.log(arguments, name);
      };
    }
  });
  return proxy;
};

export default { debug: debug, d: d };
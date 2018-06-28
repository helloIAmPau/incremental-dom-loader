const Parser = require('htmlparser2').Parser;
const adapter = require('./adapter');

module.exports = function(source) {
  const parsed = [];

  const parser = new Parser(adapter(parsed));
  parser.write(source);
  parser.end();

  return parsed.join('\n');
};

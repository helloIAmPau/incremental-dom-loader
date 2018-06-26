const prefix = require('../assets/module.prefix');
const suffix = require('../assets/module.suffix');

const parse5 = require('parse5');
const tree = require('./tree');

module.exports = function(source) {
  return `${ prefix }${ parse5.parse(source, tree) }${ suffix }`;
};

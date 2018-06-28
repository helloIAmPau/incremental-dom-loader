const prefix = require('../assets/module.prefix');
const suffix = require('../assets/module.suffix');

const parser = require('./parser');

module.exports = function(source) {
  return `${ prefix }${ parser(source) }${ suffix }`;
};

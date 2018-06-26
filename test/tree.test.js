const sm = require('sandboxed-module');

describe('The tree module', function() {

  let mut;

  beforeEach(function(done) {
    mut = sm.require('../lib/tree');

    done();
  });

});

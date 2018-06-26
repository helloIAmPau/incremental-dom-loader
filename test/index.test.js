const chai = require('chai');
const sinon = require('sinon');
const sm = require('sandboxed-module');

const { expect } = chai;
chai.use(require('sinon-chai'));


const prefix = require('../assets/module.prefix');
const suffix = require('../assets/module.suffix');

describe('The index module', function() {

  let mut;
  let parse5;
  let tree;

  beforeEach(function(done) {
    tree = {};

    parse5 = {
      parse: sinon.stub()
    };
    parse5.parse.returns('a parsed html');

    mut = sm.require('../lib/index', {
      requires: {
        parse5: parse5,
        './tree': tree
      }
    });
    done();
  });

  it('should parse the html and append prefix and suffix', function(done) {
    expect(mut('some html')).to.be.equal(`${ prefix }a parsed html${ suffix }`);
    expect(parse5.parse).to.be.calledWithExactly('some html', tree);

    done();
  });

});

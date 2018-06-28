const chai = require('chai');
const sinon = require('sinon');
const sm = require('sandboxed-module');

const { expect } = chai;
chai.use(require('sinon-chai'));


const prefix = require('../assets/module.prefix');
const suffix = require('../assets/module.suffix');

describe('The index module', function() {

  let mut;
  let parser;

  beforeEach(function(done) {
    parser = sinon.stub();
    parser.returns('a parsed html');

    mut = sm.require('../lib/index', {
      requires: {
        './parser': parser
      }
    });
    done();
  });

  it('should parse the html and append prefix and suffix', function(done) {
    expect(mut('some html')).to.be.equal(`${ prefix }a parsed html${ suffix }`);
    expect(parser).to.be.calledWithExactly('some html');

    done();
  });

});

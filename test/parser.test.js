const chai = require('chai');
const sinon = require('sinon');
const sm = require('sandboxed-module');

const { expect } = chai;
chai.use(require('sinon-chai'));

describe('The parser module', function() {

  let mut;
  let htmlparser2;
  let adapter;
  let adapterFactory;
  let hp2Constructor;

  beforeEach(function(done) {
    adapter = {};

    adapterFactory = sinon.stub();
    adapterFactory.returns(adapter);

    htmlparser2 = {
      write: sinon.spy(function() {
        adapterFactory.getCall(0).args[0].push('test source', 'second line');
      }),
      end: sinon.spy()
    };

    hp2Constructor = sinon.stub();
    hp2Constructor.returns(htmlparser2);

    mut = sm.require('../lib/parser', {
      requires: {
        './adapter': adapterFactory,
        htmlparser2: {
          Parser: hp2Constructor
        }
      }
    });

    done();
  });

  it('should trigger the html2parser with the custom config', function(done) {
    const res = mut('an html string');
    expect(htmlparser2.end).to.be.calledAfter(htmlparser2.write);
    expect(htmlparser2.write).to.be.calledWithExactly('an html string');
    expect(hp2Constructor).to.be.calledWithNew;
    expect(hp2Constructor).to.be.calledWithExactly(adapter);
    expect(res).to.be.equal('test source\nsecond line');

    done();
  });

});

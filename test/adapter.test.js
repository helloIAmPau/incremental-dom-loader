const { expect } = require('chai');
const sm = require('sandboxed-module');

describe('The adapter module', function() {

  let mut;
  let state;
  let adapter;

  beforeEach(function(done) {
    mut = sm.require('../lib/adapter', {
      globals: {
        Math: {
          random: function() {
            return 123456789;
          }
        }
      }
    });

    state = [];
    adapter = mut(state);

    done();
  });

  it('should add a text node', function(done) {
    adapter.ontext(' some text  ');
    expect(state[0]).to.be.equal('id.text(`some text`);');

    done();
  });

  it('should skip text node on void text', function(done) {
    adapter.ontext(' \n ');
    expect(state).to.be.empty;

    done();
  });

  it('should open a tag', function(done) {
    adapter.onopentag('sometag', {
      staticAttr: 'with text',
      dynText: '${ with.dots.varName } static text',
      mulDynText: '${ varName } static text ${ otherVarName }',
      onlyVar: '${ otherVar }'
    });
    expect(state[0]).to.be.equal('id.elementOpen(\'sometag\', \'a44a1\', [\'staticAttr\', \'with text\'], \'dynText\', `${ with.dots.varName } static text`, \'mulDynText\', `${ varName } static text ${ otherVarName }`, \'onlyVar\', otherVar);');

    done();
  });

  it('should close a tag', function(done) {
    adapter.onopentag('sometag', {});
    adapter.onclosetag('sometag');
    expect(state[1]).to.be.equal('id.elementClose(\'sometag\');');

    done();
  });

  it('should implement custom dom-if tag', function(done) {
    adapter.onopentag('dom-if', {
      test: '${ some test }'
    });
    adapter.onclosetag('dom-if');

    expect(state[0]).to.be.equal('if(some test) {');
    expect(state[1]).to.be.equal('}');

    done();
  });

  it('should implement custom dom-loop tag', function(done) {
    adapter.onopentag('dom-loop', {
      items: '${ someItems }'
    });
    adapter.onclosetag('dom-loop');

    expect(state[0]).to.be.equal('for(const key of Object.keys(someItems)) { const value = someItems[key];');
    expect(state[1]).to.be.equal('}');

    done();
  });

  it('should append the key to the id when opening a node in a loop', function(done) {
    adapter.onopentag('dom-loop', {
      items: '${ someItems }'
    });
    adapter.onopentag('standard', {});
    adapter.onclosetag('standard');
    adapter.onclosetag('dom-loop');
    adapter.onopentag('anotherstandard', {});
    adapter.onclosetag('anotherstandard');


    expect(state[1]).to.be.equal('  id.elementOpen(\'standard\', `a44a1-${ key }`, []);');
    expect(state[4]).to.be.equal('id.elementOpen(\'anotherstandard\', \'a44a1\', []);');

    done();
  });

  it('should indent the code', function(done) {
    adapter.onopentag('first', {});
    adapter.ontext('first text');
    adapter.onopentag('second', {});
    adapter.ontext('second text');
    adapter.onclosetag('second', {});
    adapter.onclosetag('first', {});

    expect(state[0]).to.be.equal('id.elementOpen(\'first\', \'a44a1\', []);');
    expect(state[1]).to.be.equal('  id.text(`first text`);');
    expect(state[2]).to.be.equal('  id.elementOpen(\'second\', \'a44a1\', []);');
    expect(state[3]).to.be.equal('    id.text(`second text`);');
    expect(state[4]).to.be.equal('  id.elementClose(\'second\');');
    expect(state[5]).to.be.equal('id.elementClose(\'first\');');

    done();
  });

  it('should skip body on custom elements', function(done) {
    adapter.onopentag('custom-element', {});
    expect(state[0]).to.be.equal('id.elementOpen(\'custom-element\', \'a44a1\', []);\n  id.skip();');

    done();
  });
});

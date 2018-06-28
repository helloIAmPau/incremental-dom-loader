const rx = /\${[a-z0-9\s\\.]+}/ig;

const tags = {
  domLoop: function(tagName, attrs) {
    return `for(const current of ${ attrs.items.trim().slice(2, -1).trim() }) {`;
  },
  domIf: function(tagName, attrs) {
    return `if(${ attrs.test.trim().slice(2, -1).trim() }) {`;
  },
  default: function(tagName, attrs) {
    let args = [ `'${ tagName }'`, `'${ Math.random().toString(26).slice(-5) }'`, [] ];

    Object.keys(attrs).forEach(function(key) {
      const value = attrs[key];

      const matches = value.match(rx) || [];
      if (matches.length === 1 && value.startsWith('${') && value.endsWith('}')) {
        args = args.concat([ `'${ key }'`, value.slice(2, -1).trim() ]);
      } else if (matches.length > 0) {
        args = args.concat([ `'${ key }'`, `\`${ value }\`` ]);
      } else {
        args[2] = args[2].concat([ `'${ key }'`, `'${ value }'` ]);
      }
    });

    args[2] = `[${ args[2].join(', ') }]`;

    return `id.elementOpen(${ args.join(', ') });`;
  }
};

let level = 0;
module.exports = function(state) {
  const _adapter = {};

  _adapter.onopentag = function(tagName, attrs) {
    let parsed;

    switch(tagName) {
      case 'dom-loop':
        parsed = tags.domLoop(tagName, attrs);
        break;
      case 'dom-if':
        parsed = tags.domIf(tagName, attrs);
        break;
      default:
        parsed = tags.default(tagName, attrs);
    }

    state.push(`${ Array(level++).fill('  ').join('') }${ parsed }`);
  };

  _adapter.ontext = function(text) {
    text = text.trim();

    if(text.length == 0) {
      return;
    }

    state.push(`${ Array(level).fill('  ').join('') }id.text(\`${ text }\`);`);
  };

  _adapter.onclosetag = function(tagName) {
    let parsed;

    switch(tagName) {
      case 'dom-loop':
      case 'dom-if':
        parsed = '}';
        break;
      default:
        parsed = `id.elementClose('${ tagName }');`;
    }

    state.push(`${ Array(--level).fill('  ').join('') }${ parsed }`);
  };

  return _adapter;
};

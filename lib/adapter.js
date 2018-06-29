const rx = /\${[a-z0-9\s\\.]+}/ig;

const tags = {
  domLoop: function(tagName, attrs) {
    const items = attrs.items.trim().slice(2, -1).trim();

    return `for(const key of Object.keys(${ items })) { const value = ${ items }[key]`;
  },
  domIf: function(tagName, attrs) {
    return `if(${ attrs.test.trim().slice(2, -1).trim() }) {`;
  },
  default: function(tagName, attrs, mods) {
    let staticKey = Math.random().toString(26).slice(-5);
    if(mods.dynKey === true) {
      staticKey = `\`${ staticKey }-\${ key }\``;
    } else {
      staticKey = `'${ staticKey }'`;
    }

    let args = [ `'${ tagName }'`, staticKey, [] ];

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
  const mods = {};

  _adapter.onopentag = function(tagName, attrs) {
    let parsed;

    switch(tagName) {
      case 'dom-loop':
        parsed = tags.domLoop(tagName, attrs, mods);
        mods.dynKey = true;
        break;
      case 'dom-if':
        parsed = tags.domIf(tagName, attrs, mods);
        break;
      default:
        parsed = tags.default(tagName, attrs, mods);
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
        delete mods.dynKey;
        break;
      default:
        parsed = `id.elementClose('${ tagName }');`;
    }

    state.push(`${ Array(--level).fill('  ').join('') }${ parsed }`);
  };

  return _adapter;
};

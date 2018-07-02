<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# incremental-dom-loader
[![Build Status](https://travis-ci.org/helloIAmPau/incremental-dom-loader.svg?branch=master)](https://travis-ci.org/helloIAmPau/incremental-dom-loader)
[![npm](https://img.shields.io/npm/v/incremental-dom-loader.svg)](https://www.npmjs.com/package/incremental-dom-loader)

An incremental-dom loader for webpack. It compiles an HTML file into an incremental-dom script.

## Getting Started

Install `incremental-dom-loader` via `npm`:

```console
$ npm install --save-dev incremental-dom-loader
```

then add the it to your `webpack.config.js`:

```js
module.exports = {
  ...
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'incremental-dom-loader'
    }, ...]
  }
};
```

## Usage

`incremental-dom-loader` transpiles HTML code into incremental-dom js scripts so that you can seamless include them as part of your webpack bundle.

In your project dir create a plain HTML file (e.g. `simple.html`):
```HTML
<h1>Hello!</h1>
```

and in your js code require it as usual:
```js
const simple = require('./simple.html');
```

During the build step the HTML file will be converted into:
```js
var id = require('incremental-dom');

module.exports = function(state) {
  id.elementOpen('h1', 'lh5kf', []);
    id.text(`Hello!`);
  id.elementClose('h1');
};
```

that can be passed as argument of the patch function:
```js
patch(root, function() {
  simple(data);
});
```

## Rules

`incremental-dom-loader` levereges on [htmlparser2](https://github.com/fb55/htmlparser2) for the HTML code parsing.
The build process follows the following rules:

* Add static suffix/prefix to the code including `incremental-dom` requires and `exports`,
* An open tag is converted into:
```js
id.elementOpen('tagName', 'an unique id', [ 'static', 'attribute' ], 'dynamic', 'attribute');
```
* A text element is converted into:
```js
id.text(`Hello!`);
```
* A close tag is converted into:
```js
id.elementClose('tagName');
```

Moreover `incremental-dom-loader` provides a template engine system based on the ES6 template literals.

```html
<h1>Hello!</h1>

<dom-if test="${ state.check() }">
  <dom-loop items="${ state.items }">
    <h2>${ value.title }</h2>
    <p>${ value.text }</p>
    <button onclick="${ state.love }">Show Love!</button>
  </dom-loop>
</dom-if>
```

```js
var id = require('incremental-dom');

module.exports = function(state) {
  id.elementOpen('h1', 'hio0k', []);
    id.text(`Hello!`);
  id.elementClose('h1');
  if(state.check()) {
    for(const key of Object.keys(state.items)) {
      const value = state.items[key];
      id.elementOpen('h2', `ncj5k-${ key }`, []);
        id.text(`${ value.title }`);
      id.elementClose('h2');
      id.elementOpen('p', `jde79-${ key }`, []);
        id.text(`${ value.text }`);
      id.elementClose('p');
      id.elementOpen('button', `eima7-${ key }`, [], 'onclick', state.love);
        id.text(`Show Love!`);
      id.elementClose('button');
    }
  }
}
```

All the attributes/text nodes containing `${ ... }` are converted into js template litterals. The `state` variable represents the argument you pass to the template function.

The `dom-if` and `dom-loop` pseudo-elements can be used to create `if` and `for` statements:

### dom-if

```html
<dom-if test="${ state.check() }">
  <!-- if test is true -->
</dom-if>
```

```js
if(state.check()) {
  // ...
}
```

### dom-loop

```html
<dom-loop items="${ state.items }">
  <!-- loop over state.items -->
</dom-loop>
```

```js
for(const key of Object.keys(state.items)) {
  const value = state.items[key];
  // ...
}
```

## License

#### [MIT](./LICENSE)

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

# incremental-dom-loader

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

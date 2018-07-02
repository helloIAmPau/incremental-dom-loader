const simple = require('./simple.html');
const id = require('incremental-dom');

const data = {
  items: {
    first: {
      text: 'some text'
    },
    second: {
      text: 'other text'
    }
  },
  canShowLove: true,
  loveIt: function() {
    alert('<3');
  }
};

const root = document.querySelector('body');
const patch = function() {
  data.now =  new Date();

  id.patch(root, function() {
    simple(data);
  });
};
patch();
setInterval(patch, 1000);

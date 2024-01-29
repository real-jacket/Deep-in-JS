const path = require('path');
var a = require('./a');

var a1 = require('./a');

var a2 = require('./a');

console.log('cache :', require.cache);

// 删除 a 的缓存 /Users/xiaomu/code/github/Deep-in-JS/node/module/a.js

Object.keys(require.cache).forEach(function (key) {
  if (key === path.resolve(__dirname, './a.js')) delete require.cache[key];
});

console.log('cache : after', require.cache);

var a3 = require('./a');

require('babel-polyfill');
const {add} = require('./runCli');

import test from 'blue-tape';

test('add behaves well enough', assert => {
  assert.equal(add(1, 2).next().value, 3);
  assert.end();
});

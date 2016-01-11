require('babel-polyfill');
const runCli = require('./runCli');
import is from 'is';

import test from 'blue-tape';

test('runCli exists', assert => {
  assert.equal(is.defined(runCli), true);
  assert.end();
});

test('runCli takes a generator, and invokes its .next()', assert => {
  const test = 'test';
  let called = false;

  const generator = function* () {
    called = true;
    yield test;
  }

  runCli(generator);

  setTimeout(() => {
    assert.equal(called, true);
    assert.end();
  }, 0);
});


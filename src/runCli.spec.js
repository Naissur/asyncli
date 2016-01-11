require('babel-polyfill');
const runCli = require('./runCli');
import is from 'is';

import {expectToFailWith} from './testUtils';
import test from 'blue-tape';
import Promise from 'bluebird';

test('runCli exists', assert => {
  assert.equal(is.defined(runCli), true);
  assert.end();
});

test('runCli throws correct error when called not with a function', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => runCli(args)),
          `runCli: ${ JSON.stringify(args) } is not a valid generator`
        );

  const tests = [ 
    123, {}, [], ''
  ].map(wrapInInvertedAttempt);

  return Promise.all(tests);
});

test('runcli returns a promise', assert => {
  const result = runCli(function* () {});
  
  if (is.defined(result.then)) { assert.pass(); } else { assert.fail(); }
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

test('runCli returns a promise, which rejects if the passed generator throws error, with the same error', () => {
  const ERROR = 'some error';

  const generator = function* () {
    throw ERROR;
  }

  const promise = runCli(generator);

  return expectToFailWith(
    promise, ERROR
  );
});

test('runCli resumes the passed generator with a value returned by yield expression', assert => {
  const test = 'test';
  let resumedWith;

  const generator = function* () {
    resumedWith = yield test;
  }

  return runCli(generator)
        .then( () => {
          assert.equal(resumedWith, test);
        });
});

test('runCli runs correctly with yielded promises', assert => {
  const testValue = 'testValue';
  const test = Promise.resolve(testValue);
  let resumedWith;

  const generator = function* () {
    resumedWith = yield test;
  }

  return runCli(generator)
        .then( () => {
          assert.equal(resumedWith, testValue);
        });
});

test(`runCli's promise rejects if one of yielded promises fails`, assert => {
  const testError = 'testError';
  const test = Promise.reject(testError);

  const generator = function* () {
    yield test;
  }

  return runCli(generator)
        .then( () => {
          throw 'Expected to fail';
        }, err => {
          assert.equal(err, testError);
        });
});


test('runCli runs a generator in a loop, invoking its .next() until it runs out of output, and then resolves the returned promise with the last yield', assert => {
  const test = 'test';
  let timesCalled = 0;

  const generator = function* () {
    timesCalled++;
    yield test;
    timesCalled++;
    yield test;
    timesCalled++;
    yield test;
  }

  return runCli(generator)
        .then( result => {
          assert.equal(result, test);
          assert.equal(timesCalled, 3);
        });
});



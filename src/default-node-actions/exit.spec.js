import test from 'blue-tape';
import {getExitAction, runExitAction} from './exit';
import {EXIT_ACTION} from './constants';
import {expectToFailWith} from '../test-utils';
import Promise from 'bluebird';
import assert from 'assert';
import is from 'is';

test('getExitAction returns a valid exit action descriptor', assert => {
  const result = getExitAction();

  assert.deepEqual({ type: EXIT_ACTION }, result);
  assert.end();
});


test('runExitAction returns a Promise', assert => {
  const result = runExitAction();

  assert.equal(is.defined(result.then), true, 'has .then');
  assert.end();
});


test('runExitAction fails with invalid params correctly', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => runExitAction(args)),
          `runExitAction: ${ JSON.stringify(args) } is not a valid command`
        );

  const tests = [ 
    123, {}, [], '', 
    { type: '123' },
    { type: 123 },
    { type: null }
  ].map(wrapInInvertedAttempt);
   
  return Promise.all(tests);
});


test('runExitAction invokes process.exit', () => {
  let invoked = false;
  let invokedWith = []
  global.process.exit = (...args) => {
    invoked = true;
    invokedWith = args;
  };
  
  return runExitAction(getExitAction())
        .then( () => {
          assert.equal(invoked, true, 'Expected to invoke process.exit()');
          assert.deepEqual(invokedWith, [0], 'Expected to invoke process.exit() with [0] as an argument');
        });
});


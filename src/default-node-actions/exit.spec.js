import test from 'blue-tape';
import {exit, runExitAction} from './exit';
import {Maybe} from 'ramda-fantasy';

const {Just, Nothing} = Maybe;


test('runExitAction() returns a Nothing instance when called with an invalid descriptor', t => {
  const tests = [ 
    1, {}, [],
    {type: 1, message: null},
    {type: 'abc', message: null}
  ];

  tests.forEach(args => {
    const got = runExitAction(args);
    t.equal(got, Nothing(), `expect to be a Left instance on ${JSON.stringify(args)}`);
  });
   
  t.end();
});


test('runExitAction(exit()) returns Just(true) and invokes process.exit with [0]', t => {
  let invoked = false;
  let invokedWith = []
  global.process.exit = (...args) => {
    invoked = true;
    invokedWith = args;
  };
  

  const got = runExitAction(exit());

  
  t.deepEqual(got, Just(true), 'returns Right(true)');
  t.equal(invoked, true, 'invokes process.exit()');
  t.deepEqual(invokedWith, [0], 'invokes process.exit() with [0] as an argument');
  t.end();
});



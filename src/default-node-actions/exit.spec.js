import test from 'blue-tape';
import {getExitAction, runExitAction} from './exit';
import {Either} from 'ramda-fantasy';

const {Right} = Either;


test('runExitAction() returns a Left instance when called with an invalid descriptor', t => {
  const tests = [ 
    1, {}, [],
    {type: 1, message: null},
    {type: 'abc', message: null}
  ];

  tests.forEach(args => {
    const got = runExitAction(args);

    got.bimap(      //for lack of isLeft in the current version
      val => {
        t.equal(val, `runExitAction: ${ JSON.stringify(args) } is not a valid action descriptor`);
      }, 
      () => t.fail(`expected to be a Left instance on ${JSON.stringify(args)}`)
    );
  });

   
  t.end();
});


test('runExitAction(getExitAction()) returns Right(true) and invokes process.exit with [0]', t => {
  let invoked = false;
  let invokedWith = []
  global.process.exit = (...args) => {
    invoked = true;
    invokedWith = args;
  };
  

  const got = runExitAction(getExitAction());

  
  t.deepEqual(got, Right(true), 'returns Right(true)');
  t.equal(invoked, true, 'invokes process.exit()');
  t.deepEqual(invokedWith, [0], 'invokes process.exit() with [0] as an argument');
  t.end();
});



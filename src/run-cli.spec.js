require('babel-polyfill');
import {test} from 'tap';

import defaultYieldHandler from './default-node-actions';

// proxy require run-cli with stubbed co-dispatchable's run

import proxyquire from 'proxyquire';

const coStub = {
  __esModule: true,
  default: () => {}
};

const runCli = proxyquire('./run-cli', {'co-dispatchable': coStub}).default;


test('run-cli throws a correct error on invalid generator inputs', t => {
  const inputs = [
    123, null, {}, function() {}
  ];
  

  inputs.forEach(input => {
    try {
      runCli(input);
    } catch (e) {
      t.equal(e.message, `runCli: ${ JSON.stringify(input) } is not a generator function`, 'throws correct error');
    }
  });


  t.end();
});

test('run-cli throws a correct error on invalid yield transformer inputs', t => {
  const inputs = [
    123, null, {}
  ];
  

  inputs.forEach(input => {
    try {
      runCli(function* () {}, input);
    } catch (e) {
      t.equal(e.message, `runCli: ${ JSON.stringify(input) } is not a function`, 'throws correct error');
    }
  });


  t.end();
});


test(`run-cli invokes co-dispatchable's [co] with the correct arguments`, t => {
  const inputs = [
    [function* () {}, () => {}],
    [function* () {}, () => 2]
  ];
  

  inputs.forEach(input => {
    let invokedWith = [];
    coStub.default = (...args) => { invokedWith = args };

    runCli(...input);

    t.deepEqual(invokedWith, invokedWith, `invokes ${ JSON.stringify(input) } correctly`);
  });


  t.end();
});


test(`run-cli passes default-node-actions yield handler if none was provided`, t => {
  let invokedWith = [];
  coStub.default = (...args) => { invokedWith = args };
  const generator = function* () {};


  runCli(generator);


  t.deepEqual(invokedWith, [generator, defaultYieldHandler], `invokes correctly`);
  t.end();
});



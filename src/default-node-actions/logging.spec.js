import test from 'blue-tape';
import jsc from 'jsverify';
import _ from 'ramda';
import Promise from 'bluebird';
import {expectToFailWith} from '../test-utils';


import {LOG_INFO, LOG_ERROR} from './logging-schemas';
import proxyquire from 'proxyquire';
const clc = require('cli-color');

// proxy require default with stubbed log
const utilsStub = {
  log: () => {},
  '@noCallThru': true
};

const logging = proxyquire('./logging', {'./utils': utilsStub});
const {logInfo, logError, runLogAction} = logging;




// ==================== //
// =       INFO       = //
// ==================== //

test('logInfo fails with invalid params correctly', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => logInfo(args)),
          `logInfo: ${ JSON.stringify(args) } is not a valid message`
        );

  const tests = [ 
    123, {}, []
  ].map(wrapInInvertedAttempt);

   
  return Promise.all(tests);
});

test('logInfo returns a valid action format', () => {
  const tests = jsc.forall(
    'nestring',
    message => (
      _.equals({ type: LOG_INFO, message }, logInfo(message))
    )
  );
   
  return Promise.attempt(() => jsc.assert(tests));
});





// ==================== //
// =      ERROR       = //
// ==================== //


test('logError fails with invalid params correctly', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => logError(args)),
          `logError: ${ JSON.stringify(args) } is not a valid message`
        );

  const tests = [ 
    123, {}, []
  ].map(wrapInInvertedAttempt);


  return Promise.all(tests);
});

test('logError returns a valid action format', () => {
  const tests = jsc.forall(
    'nestring',
    message => (
      _.equals({ type: LOG_ERROR, message }, logError(message))
    )
  );
   
  return Promise.attempt(() => jsc.assert(tests));
});



// ===================== //
// =     EXECUTING     = //
// ===================== //


test('runLogAction() returns a Left instance when called with an invalid descriptor', t => {
  const tests = [ 
    1, {}, [],
    {type: 1, message: null},
    {type: 'abc', message: null},
    {type: LOG_ERROR, message: null},
    {type: LOG_ERROR, message: 1},

    {type: LOG_INFO, message: null},
    {type: LOG_INFO, message: 1},
    {type: LOG_INFO, message: ''}
  ];

  tests.forEach(args => {
    const got = runLogAction(args);

    got.bimap(      //for lack of isLeft in the current version
      val => {
        t.equal(val, `runLogAction: ${ JSON.stringify(args) } is not a valid message format`);
      }, 
      () => t.fail(`expected to be a Left instance on ${JSON.stringify(args)}`)
    );
  });

   
  t.end();
});



test(`runLogAction(logError(...)) calls log() from 'log' module with correct params`, t => {
  const MESSAGE = 'MESSAGE';
  let logParams = [];
  utilsStub.log = (...args) => { logParams = args };


  runLogAction(logError(MESSAGE));


  t.deepEqual(logParams, [clc.bold.red(`[Error] ${MESSAGE}`)]);
  t.end();
});


test(`runLogAction(logInfo(...)) calls log() from 'log' module with correct params`, t => {
  const MESSAGE = 'MESSAGE';
  let logParams = [];
  utilsStub.log = (...args) => { logParams = args };


  runLogAction(logInfo(MESSAGE));


  t.deepEqual(logParams, [`${clc.bold.green('[Info]')} ${MESSAGE}`]);
  t.end();
});



import test from 'blue-tape';
import Promise from 'bluebird';
import {expectToFailWith} from '../test-utils';

import {Maybe} from 'ramda-fantasy';
const {Nothing} = Maybe;


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
    undefined, 123, {}, []
  ].map(wrapInInvertedAttempt);


  return Promise.all(tests);
});



// ===================== //
// =     EXECUTING     = //
// ===================== //


test('runLogAction() returns a Nothing instance when called with an invalid descriptor', t => {
  const tests = [ 
    undefined, 1, {}, [],
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
    t.deepEqual(got, Nothing(), `expected to be a Nothing instance on ${JSON.stringify(args)}`)
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



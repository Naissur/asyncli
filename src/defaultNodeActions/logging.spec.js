import test from 'blue-tape';
import is from 'is';
import assert from 'assert';
import jsc from 'jsverify';
import {expectToFailWith} from '../testUtils';
import _ from 'ramda';
import Promise from 'bluebird';
import {LOG_INFO, LOG_ERROR} from './constants';
import proxyquire from 'proxyquire';
const clc = require('cli-color');

// proxy require default with stubbed log
const utilsStub = {
  log: () => {},
  '@noCallThru': true
};

const logging = proxyquire('./logging', {'./utils': utilsStub});
const {getInfoLogAction, getErrorLogAction, runLogAction} = logging;




// ==================== //
// =       INFO       = //
// ==================== //

test('getInfoLogAction fails with invalid params correctly', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => getInfoLogAction(args)),
          `getInfoLogAction: ${ JSON.stringify(args) } is not a valid message`
        );

  const tests = [ 
    123, {}, []
  ].map(wrapInInvertedAttempt);

   
  return Promise.all(tests);
});

test('getInfoLogAction returns a valid action format', () => {
  const tests = jsc.forall(
    'nestring',
    message => (
      _.equals({ type: LOG_INFO, message }, getInfoLogAction(message))
    )
  );
   
  return Promise.attempt(() => jsc.assert(tests));
});





// ==================== //
// =      ERROR       = //
// ==================== //


test('getErrorLogAction fails with invalid params correctly', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => getErrorLogAction(args)),
          `getErrorLogAction: ${ JSON.stringify(args) } is not a valid message`
        );

  const tests = [ 
    123, {}, []
  ].map(wrapInInvertedAttempt);


  return Promise.all(tests);
});

test('getErrorLogAction returns a valid action format', () => {
  const tests = jsc.forall(
    'nestring',
    message => (
      _.equals({ type: LOG_ERROR, message }, getErrorLogAction(message))
    )
  );
   
  return Promise.attempt(() => jsc.assert(tests));
});




// ==================== //
// =      EXECUTE     = //
// ==================== //


test('runLogAction() fails with invalid log message format', () => {
  const wrapInInvertedAttempt = args => 
        expectToFailWith(
          Promise.attempt(() => runLogAction(args)),
          `executeLogAction: ${ JSON.stringify(args) } is not a valid message format`
        );

  const tests = [ 
    1, {}, [],
    {type: 1, message: null},
    {type: 'abc', message: null},
    {type: LOG_ERROR, message: null},
    {type: LOG_ERROR, message: 1},

    {type: LOG_INFO, message: null},
    {type: LOG_INFO, message: 1},
    {type: LOG_INFO, message: ''}
  ].map(wrapInInvertedAttempt);

   
  return Promise.all(tests);
});


test(`runLogAction() returns a Promise`, assert => {
  const result = runLogAction({});
  
  if (is.defined(result.then)) {
    assert.pass();
  } else {
    assert.fail();
  }

  assert.end();
});


test(`runLogAction(getErrorLogAction(...)) calls log() from 'log' module with correct params`, () => {
  const MESSAGE = 'MESSAGE';

  let logParams = [];
  utilsStub.log = (...args) => {logParams = args};

  return runLogAction(getErrorLogAction(MESSAGE))
        .then( () => {
          assert.deepEqual(logParams, [`${clc.bold.red('[Error]')} ${MESSAGE}`]);
        });
});

test(`runLogAction(getInfoLogAction(...)) calls log() from 'log' module with correct params`, () => {
  const MESSAGE = 'MESSAGE';

  let logParams = [];
  utilsStub.log = (...args) => {logParams = args};

  return runLogAction(getInfoLogAction(MESSAGE))
        .then( () => {
          assert.deepEqual(logParams, [`${clc.bold.green('[Info]')} ${MESSAGE}`]);
        });
});



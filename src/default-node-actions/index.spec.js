import test from 'blue-tape';
import proxyquire from 'proxyquire';
import {Maybe} from 'ramda-fantasy';
const {Nothing} = Maybe;

const clc = require('cli-color');


// proxy require default with stubbed log
const utilsStub = {
  log: () => {},
  '@runtimeGlobal': true
};

const index = proxyquire('./index', {'./utils': utilsStub});
const {default: defaultHandler, logError, logInfo, exit} = index;


// ======================================== //
// =            invalid input             = //
// ======================================== //


test('defaultHandler returns Nothing() on invalid params correctly', t => {
  const tests = [ 
    123, {}, [], 
    { type: 'some random type' },
    { type: null },
    { type: 123 }
  ];
  
  tests.forEach(
    arg => t.deepEqual(defaultHandler(arg), Nothing(), `defaultHandler( ${ JSON.stringify(arg) } ) === Nothing`)
  )

   
  t.end();
});





// ==================== //
// =     logging     = //
// ==================== //

// info

test('defaultHandler(logInfo(...)) logs an info message', t => {
  const MESSAGE = 'MESSAGE';
  let logParams = [];
  utilsStub.log = (...args) => { logParams = args };


  defaultHandler(logInfo(MESSAGE));


  t.deepEqual(logParams, [`${ clc.bold.green('[Info]') } ${ MESSAGE }`]);
  t.end();
});

// error

test('defaultHandler(logError(...)) logs an info message', t => {
  const MESSAGE = 'MESSAGE';
  let logParams = [];
  utilsStub.log = (...args) => { logParams = args };


  defaultHandler(logError(MESSAGE));


  t.deepEqual(logParams, [clc.bold.red(`[Error] ${MESSAGE}`)]);
  t.end();
});




// ===================== //
// =      exiting      = //
// ===================== //


test('defaultHandler(exit()) invokes process.exit with [0]', t => {
  let invoked = false;
  let invokedWith = []
  global.process.exit = (...args) => {
    invoked = true;
    invokedWith = args;
  };
  

  defaultHandler(exit());

  
  t.equal(invoked, true, 'invokes process.exit()');
  t.deepEqual(invokedWith, [0], 'invokes process.exit() with [0] as an argument');
  t.end();
});



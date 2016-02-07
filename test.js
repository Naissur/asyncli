import runCli from '.';
import {logInfo, logError}  from './lib/default-node-actions';

const generator = function* () {
  yield logInfo('Some precious info here');
  return logError('Oops... Some error occurred!');
}

runCli(generator);


import runCli from 'asyncli';
import {logInfo, logError, requestInput, exit} from 'asyncli/defaultNodeActions';
import parse from './parse';

runCli(main);

function* main(){
  yield logInfo('Type a number:');
  const input = yield requestInput('Some info');

  try {
    const parsed = parse(input);
    yield logInfo(`Parse result: ${parsed}`);

  } catch (e) {
    yield logError('Unable to parse input!');
  }

  yield exit();
}


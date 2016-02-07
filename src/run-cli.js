import is from 'is';
import co from 'co-dispatchable';
import defaultYieldHandler from './default-node-actions';
import {isGeneratorFunction} from './utils';


export default function runCli(generator, yieldHandler = defaultYieldHandler) {
  if (!isGeneratorFunction(generator)) throw new Error(`runCli: ${ JSON.stringify(generator) } is not a generator function`);
  if (!is.fn(yieldHandler)) throw new Error(`runCli: ${ JSON.stringify(yieldHandler) } is not a function`);

  return co(generator, yieldHandler);
}


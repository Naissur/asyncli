import is from 'is';
// import Promise from 'bluebird';
import co from 'co-dispatchable';
import defaultYieldHandler from 'co-dispatchable/lib/co-handler';


export default function runCli(generator, yieldHandler = defaultYieldHandler) {
  if (!is.fn(yieldHandler)) throw `runCli: ${ JSON.stringify(yieldHandler) } is not a valid function`;
  if (!is.fn(generator)) throw `runCli: ${ JSON.stringify(generator) } is not a valid generator`;

  return co(generator, yieldHandler);
}


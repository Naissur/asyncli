import {logInfo, logError, runLogAction} from './logging';
import {exit, runExitAction} from './exit';
import combine from 'co-dispatchable/lib/combine';

export {
  logInfo, logError,
  exit
};

export default combine([runLogAction, runExitAction]);


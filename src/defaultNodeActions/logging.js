import is from 'is';
import {LOG_INFO, LOG_ERROR} from './constants';
import {LOG_ACTION_SCHEMA} from './schemas';
import {log} from './utils';
import {match, when} from 'match-when';
const clc = require('cli-color');

export function getInfoLogAction(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw `getInfoLogAction: ${ JSON.stringify(msg) } is not a valid message`;
  }

  return {
    type: LOG_INFO,
    message: msg
  }
}

export function getErrorLogAction(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw `getErrorLogAction: ${ JSON.stringify(msg) } is not a valid message`;
  }

  return {
    type: LOG_ERROR,
    message: msg
  }
}

export function runLogAction(logAction) {
  return LOG_ACTION_SCHEMA.validate(logAction)
        .catch( () => { throw `executeLogAction: ${ JSON.stringify(logAction) } is not a valid message format`; })
        .then(validAction =>
          match({
            [when(LOG_INFO)]: () => logInfo(validAction.message),
            [when(LOG_ERROR)]: () => logError(validAction.message)
          })(validAction.type)
        )
}

function logInfo(message) {
  log(clc.bold.green('[Info]') + ' ' + message);
}

function logError(message) {
  log(clc.bold.red('[Error] ' + message));
}

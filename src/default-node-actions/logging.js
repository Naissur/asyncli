import is from 'is';
import {LOG_INFO, LOG_ERROR, validateLogAction} from './logging-schemas';
import {log} from './utils';
import {match, when} from 'match-when';
const clc = require('cli-color');

import {Either} from 'ramda-fantasy';
const {Left, Right} = Either;

export function logInfo(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw `logInfo: ${ JSON.stringify(msg) } is not a valid message`;
  }

  return {
    type: LOG_INFO,
    message: msg
  }
}

export function logError(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw `logError: ${ JSON.stringify(msg) } is not a valid message`;
  }

  return {
    type: LOG_ERROR,
    message: msg
  }
}

export function runLogAction(logAction) {
  const validationResult = validateLogAction(logAction);
  if (validationResult.isNothing()) return Left(`runLogAction: ${ JSON.stringify(logAction) } is not a valid message format`);

  const instance = validationResult.getOrElse({});
  const {message, type} = instance;

  return match({
    [when(LOG_INFO)]: () => Right(runLogInfo(message)),
    [when(LOG_ERROR)]: () => Right(runLogError(message))
  })(type);
}

function runLogInfo(message) {
  log(clc.bold.green('[Info]') + ' ' + message);
  return true;
}

function runLogError(message) {
  log(clc.bold.red(`[Error] ${message}`));
  return true;
}

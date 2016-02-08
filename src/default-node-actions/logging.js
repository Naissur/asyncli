import is from 'is';
import {LOG_INFO, LOG_ERROR, validateLogAction} from './logging-schemas';
import {log} from './utils';
const clc = require('cli-color');

import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;

export function logInfo(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw new Error(`logInfo: ${ JSON.stringify(msg) } is not a valid message`);
  }

  return {
    type: LOG_INFO,
    message: msg
  }
}

export function logError(msg) {
  if (!is.string(msg) || is.empty(msg)) {
    throw new Error(`logError: ${ JSON.stringify(msg) } is not a valid message`);
  }

  return {
    type: LOG_ERROR,
    message: msg
  }
}

export function runLogAction(logAction) {
  const validationResult = validateLogAction(logAction);
  if (validationResult.isNothing()) return Nothing();

  const instance = validationResult.getOrElse({});
  const {message, type} = instance;

  switch (type) {
    case LOG_INFO: return Just(runLogInfo(message));
    case LOG_ERROR: return Just(runLogError(message));
    default: return Nothing();
  }
}

function runLogInfo(message) {
  log(`${ clc.bold.green('[Info]') } ${ message }`);
  return true;
}

function runLogError(message) {
  log(clc.bold.red(`[Error] ${message}`));
  return true;
}

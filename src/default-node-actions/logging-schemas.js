import {LOG_INFO, LOG_ERROR} from './constants';

import {Validator} from 'jsonschema';
const v = new Validator();

import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;

const LOG_INFO_ACTION_SCHEMA_ID = "/LogInfoAction";
const LOG_ERROR_ACTION_SCHEMA_ID = "/LogErrorAction";
const LOG_ACTION_SCHEMA_ID = "/LogAction";

const LOG_ACTION_SCHEMA = {
  "id": "/LogAction",
  "oneOf": [
      { "$ref": LOG_INFO_ACTION_SCHEMA_ID},
      { "$ref": LOG_ERROR_ACTION_SCHEMA_ID}
  ]
}

const LOG_INFO_ACTION_SCHEMA = {
  "type": "object",
  "id": LOG_INFO_ACTION_SCHEMA_ID,
  "properties": {
    "type": {
      "type": "string",
      "enum": [ LOG_INFO ]
    },
    "message": {
      "type": "string",
      "minLength" : 1
    }
  },
  "required": [
    "type", 
    "message"
  ] 
};

const LOG_ERROR_ACTION_SCHEMA = {
  "type": "object",
  "id": LOG_ERROR_ACTION_SCHEMA_ID,
  "properties": {
    "type": {
      "type": "string",
      "enum": [ LOG_ERROR ]
    },
    "message": {
      "type": "string",
      "minLength" : 1
    }
  },
  "required": [
    "type", 
    "message"
  ] 
};

v.addSchema(LOG_INFO_ACTION_SCHEMA, '/LogInfoAction');
v.addSchema(LOG_ERROR_ACTION_SCHEMA, '/LogErrorAction');

const wrapInValidateMaybe = validationResult => (
  validationResult.valid ? Just(validationResult.instance) : Nothing()
);

export const validateLogInfoAction = action => (
  wrapInValidateMaybe(v.validate(action, LOG_INFO_ACTION_SCHEMA))
);

export const validateLogErrorAction = action => (
  wrapInValidateMaybe(v.validate(action, LOG_INFO_ACTION_SCHEMA))
);

export const validateLogAction = action => (
  wrapInValidateMaybe(v.validate(action, LOG_ACTION_SCHEMA))
);



import {validate} from './utils';

export const LOG_INFO = 'LOG_INFO';
export const LOG_ERROR = 'LOG_ERROR';

const LOG_INFO_ACTION_SCHEMA_ID = '/LogInfoAction';
const LOG_ERROR_ACTION_SCHEMA_ID = '/LogErrorAction';
const LOG_ACTION_SCHEMA_ID = '/LogAction';


const LOG_INFO_ACTION_SCHEMA = {
  'type': 'object',
  'id': LOG_INFO_ACTION_SCHEMA_ID,
  'properties': {
    'type': {
      'type': 'string',
      'enum': [ LOG_INFO ]
    },
    'message': {
      'type': 'string',
      'minLength' : 1
    }
  },
  'required': [
    'type', 
    'message'
  ] 
};

const LOG_ERROR_ACTION_SCHEMA = {
  'type': 'object',
  'id': LOG_ERROR_ACTION_SCHEMA_ID,
  'properties': {
    'type': {
      'type': 'string',
      'enum': [ LOG_ERROR ]
    },
    'message': {
      'type': 'string',
      'minLength' : 1
    }
  },
  'required': [
    'type', 
    'message'
  ] 
};

const LOG_ACTION_SCHEMA = {
  'id': LOG_ACTION_SCHEMA_ID,
  'type': 'object',
  'oneOf': [
    LOG_INFO_ACTION_SCHEMA,
    LOG_ERROR_ACTION_SCHEMA
  ]
}



export const validateLogInfoAction = x => validate(LOG_INFO_ACTION_SCHEMA, x);
export const validateLogErrorAction = x => validate(LOG_INFO_ACTION_SCHEMA, x);
export const validateLogAction = x => validate(LOG_ACTION_SCHEMA, x);



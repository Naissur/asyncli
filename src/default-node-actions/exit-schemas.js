import {validate} from './utils';

export const EXIT_ACTION = 'EXIT_ACTION';
export const EXIT_ACTION_SCHEMA_ID = '/ExitAction';


const EXIT_ACTION_SCHEMA = {
  'type': 'object',
  'id': EXIT_ACTION_SCHEMA_ID,
  'properties': {
    'type': {
      'type': 'string',
      'enum': [ EXIT_ACTION ]
    }
  },
  'required': [ 'type' ]
};

export const validateExitAction = x => validate(EXIT_ACTION_SCHEMA, x);


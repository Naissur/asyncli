import {EXIT_ACTION} from './constants';

import {Validator} from 'jsonschema';
const v = new Validator();

import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;

const EXIT_ACTION_SCHEMA_ID = "/ExitAction";


const EXIT_ACTION_SCHEMA = {
  "type": "object",
  "id": EXIT_ACTION_SCHEMA_ID,
  "properties": {
    "type": {
      "type": "string",
      "enum": [ EXIT_ACTION ]
    }
  },
  "required": [ "type" ]
};

const wrapInValidateMaybe = validationResult => (
  validationResult.valid ? Just(validationResult.instance) : Nothing()
);

export const validateExitAction = action => (
  wrapInValidateMaybe(v.validate(action, EXIT_ACTION_SCHEMA))
);


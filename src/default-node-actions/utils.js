import {curry} from 'ramda';
import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;

// ==================== //
// =    validation    = //
// ==================== //

import {Validator} from 'jsonschema';
const v = new Validator();

export const validate = curry( (schema, obj) => (
  wrapInValidateMaybe(v.validate(obj, schema))
));

export const addSchema = (schema, id) => v.addSchema(schema, id);

export const wrapInValidateMaybe = validationResult => (
  validationResult.valid ? Just(validationResult.instance) : Nothing()
);



let logHistory = [];

export function log(...args){
  logHistory.push(args);

  if (console){
    console.log(...args);
  }
};

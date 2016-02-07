import is from 'is';
import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;


// ==================== //
// =    validation    = //
// ==================== //

import {Validator} from 'jsonschema';
const v = new Validator();

export const validate = (schema, obj) => {
  if (!is.defined(obj)) return Nothing();

  return wrapInValidateMaybe(v.validate(obj, schema))
}

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

const clc = require('cli-color');
const jsdiff = require('diff');

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


// ===================== //
// =      logging      = //
// ===================== //


export function logPrettyLinesDiff(a, b) {
  const diff = jsdiff.diffLines(a, b);

  diff.forEach( part => {
    // green for additions, red for deletions
    // grey for common parts
    const color = part.added ? 'green' :
                  part.removed ? 'red' : 'blackBright';
    process.stderr.write(clc[color](part.value));
  });

  console.log();
}

export function logPrettyCharsDiff(a, b) {
  const diff = jsdiff.diffChars(a, b);

  diff.forEach( part => {
    // green for additions, red for deletions
    // grey for common parts
    const color = part.added ? 'green' :
                  part.removed ? 'red' : 'blackBright';
    process.stderr.write(clc[color](part.value));
  });

  console.log();
}


let logHistory = [];

export function log(...args){
  logHistory.push(args);

  if (console){
    console.log(...args);
  }
};

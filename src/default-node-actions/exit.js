import {EXIT_ACTION, validateExitAction} from './exit-schemas';

import {Maybe} from 'ramda-fantasy';
const {Just, Nothing} = Maybe;


export function exit() {
  return {
    type: EXIT_ACTION
  };
}

export function runExitAction(action) {
  const validationResult = validateExitAction(action);
  if (validationResult.isNothing()) return Nothing();

  process.exit(0);
  return Just(true);
}


import {EXIT_ACTION, validateExitAction} from './exit-schemas';

import {Either} from 'ramda-fantasy';
const {Left, Right} = Either;


export function getExitAction() {
  return {
    type: EXIT_ACTION
  };
}

export function runExitAction(action) {
  const validationResult = validateExitAction(action);

  if (validationResult.isNothing()) return Left(`runExitAction: ${ JSON.stringify(action) } is not a valid action descriptor`);

  process.exit(0);
  return Right(true);
}


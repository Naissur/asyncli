import {EXIT_ACTION} from './constants';
import {EXIT_ACTION_SCHEMA} from './schemas';

export function getExitAction() {
  return {
    type: EXIT_ACTION
  };
}

export function runExitAction(action) {
  return EXIT_ACTION_SCHEMA.validate(action, {strict: true})
        .catch(() => {
          throw `runExitAction: ${ JSON.stringify(action) } is not a valid command`;
        })
        .then( () => {
          process.exit(0);
        });
}

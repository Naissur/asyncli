import _ from 'ramda';
import is from 'is';
import {isPromise} from '../utils';


export const expectToFail = (promise, descriptor) => {
  if (!isPromise(promise)) { throw new Error(`expectToFail: ${JSON.stringify(promise)} is not a Promise`); }

  return promise.then(() => {throw new Error(`Expected to fail${ is.defined(descriptor) ? (' on ' + descriptor) : ''}`)}, () => true);
}

export const expectToFailWith = (promise, expectedError) => {
  if (!isPromise(promise)) { throw new Error(`expectToFailWith: ${JSON.stringify(promise)} is not a Promise`); }

  return promise.then(() => {throw new Error(`Expected to fail with ${ expectedError }, instead passed`)},
   ({message}) => {
     if (!_.equals(message, expectedError) ){
       throw new Error(`Expected to fail with ${ expectedError }, instead got ${message}`);
     } else {
       return true;
     }
   });
}


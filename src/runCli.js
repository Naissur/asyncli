import is from 'is';
import Promise from 'bluebird';


module.exports = function runCli(generator) {
  if (!is.fn(generator)) {
    throw `runCli: ${ JSON.stringify(generator) } is not a valid generator`;
  }
  return new Promise(
    (resolve, reject) => {
      const it = generator();
      let ret;

      (function iterate(val){
        ret = it.next(val);

        if (!ret.done) {
          if (is.defined(ret.value) && is.defined(ret.value.then)) {
            ret.value.then( iterate, reject );
          } else {
            setTimeout( () => { iterate(ret.value) }, 0);
          }
        } else {
          resolve(val);
        }
      })();
    });
}

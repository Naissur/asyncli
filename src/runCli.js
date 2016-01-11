module.exports = function runCli(generator) {
  const gen = generator();
  const ret = gen.next();
  return ret;
}

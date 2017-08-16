// eslint-disable-next-line fp/no-rest-parameters
const IO = thunk => (...args) => ({
  type: 'IO',

  args,
  thunk,

  bind: otherIO =>
    IO(async () => {
      // eslint-disable-next-line fp/no-unused-expression
      const result = await thunk(...args);

      return otherIO.thunk(result);
    })(),

  run: () => thunk(...args),
});

const log = IO(
  msg =>
    new Promise(resolve => {
      setTimeout(() => {
        console.log(msg);

        resolve(msg);
      }, 1);
    }),
);

const foo = log('foo');
const bar = log('bar');
const baz = log('baz');

const joined = foo.bind(IO(() => bar.run())()).bind(IO(() => baz.run())());
const joined2 = foo.bind(bar).bind(baz);

(async () => {
  const result = await joined.run();
  console.log('result', result);

  const result2 = await joined2.run();
  console.log('result2', result2);
})();

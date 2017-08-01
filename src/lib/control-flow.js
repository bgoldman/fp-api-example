const controlFlow = (methods = []) => ({
  do: method => controlFlow(methods.concat({ type: 'do', method })),

  and: method => controlFlow(methods.concat({ type: 'and', method })),

  or: method => controlFlow(methods.concat({ type: 'or', method })),

  return: method => controlFlow(methods.concat({ type: 'return', method })),

  // need this here so other code thinks controlFlow is a promise
  catch: () => true,

  then: async (resolve, reject) => {
    const next = async (success, defaultReturn, remainingMethods) => {
      const done = remainingMethods.length === 0;

      const { method, type } = !done
        ? remainingMethods[0]
        : { type: 'noMethodsLeft' };
      const newRemainingMethods = !done ? remainingMethods.slice(1) : [];

      const actions = {
        do: async () => {
          const yes = await method();

          return next(yes, yes, newRemainingMethods);
        },

        and: async () => {
          const yes = success && (await method());

          return next(yes, success ? yes : defaultReturn, newRemainingMethods);
        },

        or: async () => {
          const yes = !success && (await method());

          return next(yes, !success ? yes : defaultReturn, newRemainingMethods);
        },

        return: () =>
          success
            ? method()
            : next(success, defaultReturn, newRemainingMethods),

        noMethodsLeft: () => defaultReturn,
      };

      return actions[type]
        ? actions[type]()
        : reject('Invalid control flow method.');
    };

    return resolve(await next(true, false, methods));
  },
});

export default () => controlFlow();

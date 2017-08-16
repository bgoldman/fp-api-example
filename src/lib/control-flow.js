const controlFlow = (methods = []) => ({
  do: method => controlFlow(methods.concat({ type: 'do', method })),

  and: method => controlFlow(methods.concat({ type: 'and', method })),

  or: method => controlFlow(methods.concat({ type: 'or', method })),

  map: method => controlFlow(methods.concat({ type: 'map', method })),

  return: method => controlFlow(methods.concat({ type: 'return', method })),

  // need this here so other code thinks controlFlow is a promise
  catch: () => true,

  then: async (resolve, reject) => {
    const next = async (success, context, remainingMethods) => {
      const done = remainingMethods.length === 0;

      const { method, type } = !done
        ? remainingMethods[0]
        : { type: 'noMethodsLeft' };

      const newRemainingMethods = !done ? remainingMethods.slice(1) : [];

      const actions = {
        do: async () => {
          const newContext = await method(context);

          return next(!!newContext, newContext, newRemainingMethods);
        },

        and: async () => {
          console.log('and', context);
          const newContext = success && (await method(context));
          console.log('andNC', await newContext.thunk());
          const newSuccess = !!newContext;

          return next(
            newSuccess,
            newSuccess ? newContext : context,
            newRemainingMethods,
          );
        },

        or: async () => {
          const newContext = !success && (await method(context));
          const newSuccess = !!newContext;

          return next(
            newSuccess,
            newSuccess ? newContext : context,
            newRemainingMethods,
          );
        },

        map: async () =>
          next(
            success,
            success ? await method(context) : context,
            newRemainingMethods,
          ),

        return: () =>
          success ? method(context) : next(false, context, newRemainingMethods),

        noMethodsLeft: () => context,
      };

      return actions[type]
        ? actions[type]()
        : reject('Invalid control flow method.');
    };

    return resolve(await next(true, false, methods));
  },
});

export default () => controlFlow();

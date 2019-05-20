
function isPromise(val) {
  return val && typeof val.then === 'function';
}

/**
 * A replacement for redux-thunk that will intercept and callback promises
 */
function thunkBundler(onPromise?: (promise: Promise<unknown>) => unknown) {
  return (ref: any) => {
    return (next) => {
      return (action) => {
        if (typeof action === 'function') {
          const ret = action(ref.dispatch, ref.getState);
          if (isPromise(ret) && onPromise) {
            onPromise(ret);
          }
          return ret;
        }
        return next(action);
      };
    };
  };
}

export default thunkBundler;

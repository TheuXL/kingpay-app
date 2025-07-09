// Mock para @react-native/js-polyfills/error-guard
module.exports = {
  ErrorUtils: {
    setGlobalHandler: jest.fn(),
    reportError: jest.fn(),
    reportFatalError: jest.fn()
  },
  guardedErrorString: jest.fn(str => str),
  reportFatalErrorForInitializing: jest.fn(),
  reportFatalError: jest.fn(),
  reportError: jest.fn(),
  applyWithGuard: jest.fn((fn, context, args) => {
    try {
      return fn.apply(context, args);
    } catch (e) {
      return null;
    }
  }),
  guard: jest.fn(fn => {
    return function guarded(...args) {
      try {
        return fn(...args);
      } catch (e) {
        return null;
      }
    };
  })
}; 
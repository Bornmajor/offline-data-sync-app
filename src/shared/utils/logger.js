const sensitiveKeys = new Set([
  'password',
  'secret',
  'token',
  'apiKey',
  'accessToken',
  'refreshToken',
]);

/**
 * Redacts known sensitive fields before logging in development.
 * @param {unknown} value - The value to sanitize for log output.
 * @returns {unknown} The redacted value.
 */
const redactValue = (value) => {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      code: value.code,
      stack: value.stack,
    };
  }

  if (Array.isArray(value)) {
    return value.map(redactValue);
  }

  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = sensitiveKeys.has(key) ? '[REDACTED]' : redactValue(value[key]);
      return acc;
    }, {});
  }

  return value;
};

/**
 * Development-only logger that hides secrets before writing to the console.
 */
const logger = {
  /**
   * Logs informational output in development.
   * @param {...unknown} args - Values to log.
   */
  log: (...args) => {
    if (__DEV__) {
      console.log(...args.map(redactValue));
    }
  },
  /**
   * Logs warnings in development.
   * @param {...unknown} args - Values to warn with.
   */
  warn: (...args) => {
    if (__DEV__) {
      console.warn(...args.map(redactValue));
    }
  },
  /**
   * Logs errors in development.
   * @param {...unknown} args - Values to report as errors.
   */
  error: (...args) => {
    if (__DEV__) {
      console.error(...args.map(redactValue));
    }
  },
};

export default logger;

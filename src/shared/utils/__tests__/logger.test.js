import logger from '../logger';

describe('logger secret redaction', () => {
  let logSpy;
  let warnSpy;
  let errorSpy;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('redacts known sensitive keys, including nested and array values', () => {
    logger.log('login', {
      email: 'user@test.com',
      password: 'hunter2',
      session: { token: 'abc', refreshToken: 'def', role: 'user' },
      history: [{ apiKey: 'k1' }, { apiKey: 'k2' }],
    });

    expect(logSpy).toHaveBeenCalledWith('login', {
      email: 'user@test.com',
      password: '[REDACTED]',
      session: { token: '[REDACTED]', refreshToken: '[REDACTED]', role: 'user' },
      history: [{ apiKey: '[REDACTED]' }, { apiKey: '[REDACTED]' }],
    });
  });

  it('summarises Error objects instead of leaking arbitrary fields', () => {
    const err = Object.assign(new Error('boom'), { code: 'auth/failed' });

    logger.error('failed', err);

    expect(errorSpy).toHaveBeenCalledWith('failed', {
      name: 'Error',
      message: 'boom',
      code: 'auth/failed',
      stack: expect.any(String),
    });
  });

  it('passes primitives through untouched', () => {
    logger.warn('count', 3, true, null);
    expect(warnSpy).toHaveBeenCalledWith('count', 3, true, null);
  });
});

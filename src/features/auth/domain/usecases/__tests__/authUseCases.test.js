import createGetCurrentUserEmailUseCase from '../getCurrentUserEmailUseCase';
import createRegisterUserUseCase from '../registerUserUseCase';
import createSignInUserUseCase from '../signInUserUseCase';
import createSignOutUserUseCase from '../signOutUserUseCase';

describe('auth use cases', () => {
  it('delegates sign-in and register to repository', async () => {
    const repository = {
      signInUser: jest.fn().mockResolvedValue({ ok: true, email: 'user@test.com' }),
      registerUser: jest.fn().mockResolvedValue({ ok: false, reason: 'email-already-in-use' }),
    };

    const signIn = createSignInUserUseCase(repository);
    const register = createRegisterUserUseCase(repository);

    const signInResult = await signIn('user@test.com', 'Password1!');
    const registerResult = await register('user@test.com', 'Password1!');

    expect(repository.signInUser).toHaveBeenCalledWith('user@test.com', 'Password1!');
    expect(repository.registerUser).toHaveBeenCalledWith('user@test.com', 'Password1!');
    expect(signInResult).toEqual({ ok: true, email: 'user@test.com' });
    expect(registerResult).toEqual({ ok: false, reason: 'email-already-in-use' });
  });

  it('delegates sign-out and current user lookup', async () => {
    const repository = {
      signOutUser: jest.fn().mockResolvedValue(undefined),
      getCurrentUserEmail: jest.fn(() => 'user@test.com'),
    };

    const signOut = createSignOutUserUseCase(repository);
    const getCurrentEmail = createGetCurrentUserEmailUseCase(repository);

    await signOut();
    const email = getCurrentEmail();

    expect(repository.signOutUser).toHaveBeenCalledTimes(1);
    expect(repository.getCurrentUserEmail).toHaveBeenCalledTimes(1);
    expect(email).toBe('user@test.com');
  });
});

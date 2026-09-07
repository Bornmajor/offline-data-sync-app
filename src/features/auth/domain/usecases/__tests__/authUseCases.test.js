import createGetCurrentUserUseCase from '../getCurrentUserUseCase';
import createRegisterUserUseCase from '../registerUserUseCase';
import createSignInUserUseCase from '../signInUserUseCase';
import createSignOutUserUseCase from '../signOutUserUseCase';

describe('auth use cases', () => {
  it('delegates sign-in and register to repository', async () => {
    const repository = {
      signInUser: jest.fn().mockResolvedValue({ ok: true, uid: 'uid-1', email: 'user@test.com' }),
      registerUser: jest.fn().mockResolvedValue({ ok: false, reason: 'email-already-in-use' }),
    };

    const signIn = createSignInUserUseCase(repository);
    const register = createRegisterUserUseCase(repository);

    const signInResult = await signIn('user@test.com', 'Password1!');
    const registerResult = await register('user@test.com', 'Password1!');

    expect(repository.signInUser).toHaveBeenCalledWith('user@test.com', 'Password1!');
    expect(repository.registerUser).toHaveBeenCalledWith('user@test.com', 'Password1!');
    expect(signInResult).toEqual({ ok: true, uid: 'uid-1', email: 'user@test.com' });
    expect(registerResult).toEqual({ ok: false, reason: 'email-already-in-use' });
  });

  it('delegates sign-out and current user lookup', async () => {
    const repository = {
      signOutUser: jest.fn().mockResolvedValue(undefined),
      getCurrentUser: jest.fn(() => ({ uid: 'uid-1', email: 'user@test.com' })),
    };

    const signOut = createSignOutUserUseCase(repository);
    const getCurrentUser = createGetCurrentUserUseCase(repository);

    await signOut();
    const user = getCurrentUser();

    expect(repository.signOutUser).toHaveBeenCalledTimes(1);
    expect(repository.getCurrentUser).toHaveBeenCalledTimes(1);
    expect(user).toEqual({ uid: 'uid-1', email: 'user@test.com' });
  });
});

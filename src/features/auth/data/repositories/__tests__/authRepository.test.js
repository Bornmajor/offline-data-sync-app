import createAuthRepository from '../authRepository';

describe('authRepository', () => {
  it('delegates signInUser to data source', async () => {
    const ds = {
      signInUser: jest.fn().mockResolvedValue({ ok: true, email: 'user@test.com' }),
    };

    const repo = createAuthRepository(ds);
    const result = await repo.signInUser('user@test.com', 'Password@123');

    expect(ds.signInUser).toHaveBeenCalledWith('user@test.com', 'Password@123');
    expect(result).toEqual({ ok: true, email: 'user@test.com' });
  });

  it('delegates registerUser, signOutUser, and getCurrentUserEmail', async () => {
    const ds = {
      signInUser: jest.fn(),
      registerUser: jest.fn().mockResolvedValue({ ok: true, email: 'new@test.com' }),
      signOutUser: jest.fn().mockResolvedValue(undefined),
      getCurrentUserEmail: jest.fn().mockReturnValue('new@test.com'),
    };

    const repo = createAuthRepository(ds);

    await expect(repo.registerUser('new@test.com', 'Password@123')).resolves.toEqual({
      ok: true,
      email: 'new@test.com',
    });
    await expect(repo.signOutUser()).resolves.toBeUndefined();
    expect(repo.getCurrentUserEmail()).toBe('new@test.com');

    expect(ds.registerUser).toHaveBeenCalledWith('new@test.com', 'Password@123');
    expect(ds.signOutUser).toHaveBeenCalledTimes(1);
    expect(ds.getCurrentUserEmail).toHaveBeenCalledTimes(1);
  });
});

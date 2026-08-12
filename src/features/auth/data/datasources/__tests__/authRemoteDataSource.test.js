jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('../../../../../shared/firebase/firebaseClient', () => ({
  getFirebaseAuth: jest.fn(),
}));

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '../../../../../shared/firebase/firebaseClient';
import createAuthRemoteDataSource from '../authRemoteDataSource';

describe('authRemoteDataSource', () => {
  const auth = { currentUser: null };

  beforeEach(() => {
    jest.clearAllMocks();
    getFirebaseAuth.mockReturnValue(auth);
  });

  it('signInUser normalizes email and returns success payload', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { email: 'normalized@test.com' },
    });
    const ds = createAuthRemoteDataSource();

    const result = await ds.signInUser('  USER@Test.com  ', 'Password1!');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'user@test.com', 'Password1!');
    expect(result).toEqual({ ok: true, email: 'normalized@test.com' });
  });

  it('signInUser maps invalid credentials errors', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
    const ds = createAuthRemoteDataSource();

    const result = await ds.signInUser('user@test.com', 'bad');

    expect(result).toEqual({ ok: false, reason: 'invalid-credentials' });
  });

  it('registerUser maps duplicate-email errors', async () => {
    createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });
    const ds = createAuthRemoteDataSource();

    const result = await ds.registerUser('user@test.com', 'Password1!');

    expect(result).toEqual({ ok: false, reason: 'email-already-in-use' });
  });

  it('signOutUser delegates to firebase auth', async () => {
    signOut.mockResolvedValue(undefined);
    const ds = createAuthRemoteDataSource();

    await ds.signOutUser();

    expect(signOut).toHaveBeenCalledWith(auth);
  });

  it('getCurrentUserEmail returns current user email', () => {
    auth.currentUser = { email: 'active@test.com' };
    const ds = createAuthRemoteDataSource();

    expect(ds.getCurrentUserEmail()).toBe('active@test.com');
  });
});

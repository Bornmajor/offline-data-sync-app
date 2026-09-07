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
    auth.currentUser = null;
    getFirebaseAuth.mockReturnValue(auth);
  });

  it('signInUser normalizes email and returns uid + email', async () => {
    signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'uid-1', email: 'normalized@test.com' },
    });
    const ds = createAuthRemoteDataSource();

    const result = await ds.signInUser('  USER@Test.com  ', 'Password1!');

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'user@test.com', 'Password1!');
    expect(result).toEqual({ ok: true, uid: 'uid-1', email: 'normalized@test.com' });
  });

  it('signInUser maps invalid credentials errors', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/wrong-password' });
    const ds = createAuthRemoteDataSource();

    const result = await ds.signInUser('user@test.com', 'bad');

    expect(result).toEqual({ ok: false, reason: 'invalid-credentials' });
  });

  it('signInUser rethrows unexpected errors', async () => {
    signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/network-request-failed' });
    const ds = createAuthRemoteDataSource();

    await expect(ds.signInUser('user@test.com', 'Password1!')).rejects.toEqual({
      code: 'auth/network-request-failed',
    });
  });

  it('registerUser returns uid + email on success', async () => {
    createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'uid-2', email: 'new@test.com' },
    });
    const ds = createAuthRemoteDataSource();

    const result = await ds.registerUser('New@test.com', 'Password1!');

    expect(result).toEqual({ ok: true, uid: 'uid-2', email: 'new@test.com' });
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

  it('getCurrentUser returns uid + email when signed in', () => {
    auth.currentUser = { uid: 'uid-3', email: 'active@test.com' };
    const ds = createAuthRemoteDataSource();

    expect(ds.getCurrentUser()).toEqual({ uid: 'uid-3', email: 'active@test.com' });
  });

  it('getCurrentUser returns null when signed out', () => {
    auth.currentUser = null;
    const ds = createAuthRemoteDataSource();

    expect(ds.getCurrentUser()).toBeNull();
  });
});

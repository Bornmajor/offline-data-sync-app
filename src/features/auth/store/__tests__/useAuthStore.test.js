const mockUiState = {
  setIsLoading: jest.fn(),
  showFeedback: jest.fn(),
};
const mockNotesState = {
  clearNotes: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../../../shared/store/useUiStore', () => ({
  __esModule: true,
  default: { getState: () => mockUiState },
}));

jest.mock('../../../notes/store/useNotesStore', () => ({
  __esModule: true,
  default: { getState: () => mockNotesState },
}));

jest.mock('../../../../shared/utils/logger', () => ({
  __esModule: true,
  default: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock('../../container', () => ({
  __esModule: true,
  signInUser: jest.fn(),
  registerUser: jest.fn(),
  signOutUser: jest.fn(),
  getCurrentUser: jest.fn(),
}));

import { getCurrentUser, registerUser, signInUser, signOutUser } from '../../container';
import useAuthStore from '../useAuthStore';

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ isLogin: false, usrMail: '', usrId: '' });
});

describe('login', () => {
  it('stores identity and toggles loading on success', async () => {
    signInUser.mockResolvedValue({ ok: true, uid: 'uid-1', email: 'user@test.com' });

    const ok = await useAuthStore.getState().login('user@test.com', 'Password1!');

    expect(ok).toBe(true);
    const state = useAuthStore.getState();
    expect(state).toMatchObject({ isLogin: true, usrMail: 'user@test.com', usrId: 'uid-1' });
    expect(mockUiState.setIsLoading).toHaveBeenNthCalledWith(1, true);
    expect(mockUiState.setIsLoading).toHaveBeenLastCalledWith(false);
  });

  it('shows feedback and stays logged out on invalid credentials', async () => {
    signInUser.mockResolvedValue({ ok: false, reason: 'invalid-credentials' });

    const ok = await useAuthStore.getState().login('user@test.com', 'wrong');

    expect(ok).toBe(false);
    expect(useAuthStore.getState().isLogin).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith('Incorrect email or password.');
  });

  it('handles thrown errors from the use case', async () => {
    signInUser.mockRejectedValue(new Error('network'));

    const ok = await useAuthStore.getState().login('user@test.com', 'Password1!');

    expect(ok).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith(
      'Login failed. Check network or Firebase rules.',
    );
    expect(mockUiState.setIsLoading).toHaveBeenLastCalledWith(false);
  });
});

describe('register', () => {
  it('rejects weak passwords before calling the use case', async () => {
    const ok = await useAuthStore.getState().register('user@test.com', 'weakpass');

    expect(ok).toBe(false);
    expect(registerUser).not.toHaveBeenCalled();
    expect(mockUiState.showFeedback).toHaveBeenCalledWith(
      'Password must be at least 8 characters and include a letter, number, and special character',
    );
  });

  it('logs the user in on success', async () => {
    registerUser.mockResolvedValue({ ok: true, uid: 'uid-9', email: 'new@test.com' });

    const ok = await useAuthStore.getState().register('new@test.com', 'Password1!');

    expect(ok).toBe(true);
    expect(useAuthStore.getState()).toMatchObject({
      isLogin: true,
      usrMail: 'new@test.com',
      usrId: 'uid-9',
    });
    expect(mockUiState.showFeedback).toHaveBeenCalledWith('Account created successfully.');
  });

  it('maps the email-already-in-use reason', async () => {
    registerUser.mockResolvedValue({ ok: false, reason: 'email-already-in-use' });

    const ok = await useAuthStore.getState().register('dup@test.com', 'Password1!');

    expect(ok).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith('Email already in use. Try login instead.');
  });
});

describe('session lifecycle', () => {
  it('syncAuthSession adopts the current Firebase user', () => {
    getCurrentUser.mockReturnValue({ uid: 'uid-1', email: 'user@test.com' });

    const user = useAuthStore.getState().syncAuthSession();

    expect(user).toEqual({ uid: 'uid-1', email: 'user@test.com' });
    expect(useAuthStore.getState()).toMatchObject({
      isLogin: true,
      usrMail: 'user@test.com',
      usrId: 'uid-1',
    });
  });

  it('syncAuthSession clears state when signed out', () => {
    getCurrentUser.mockReturnValue(null);
    useAuthStore.setState({ isLogin: true, usrMail: 'user@test.com', usrId: 'uid-1' });

    const user = useAuthStore.getState().syncAuthSession();

    expect(user).toBeNull();
    expect(useAuthStore.getState()).toMatchObject({ isLogin: false, usrMail: '', usrId: '' });
  });

  it('logout signs out, clears the session, and clears notes', async () => {
    signOutUser.mockResolvedValue(undefined);
    useAuthStore.setState({ isLogin: true, usrMail: 'user@test.com', usrId: 'uid-1' });

    await useAuthStore.getState().logout();

    expect(signOutUser).toHaveBeenCalledTimes(1);
    expect(useAuthStore.getState()).toMatchObject({ isLogin: false, usrMail: '', usrId: '' });
    expect(mockNotesState.clearNotes).toHaveBeenCalledTimes(1);
  });

  it('logout still clears local state when Firebase sign-out throws', async () => {
    signOutUser.mockRejectedValue(new Error('offline'));
    useAuthStore.setState({ isLogin: true, usrMail: 'user@test.com', usrId: 'uid-1' });

    await useAuthStore.getState().logout();

    expect(useAuthStore.getState().isLogin).toBe(false);
    expect(mockNotesState.clearNotes).toHaveBeenCalledTimes(1);
  });
});

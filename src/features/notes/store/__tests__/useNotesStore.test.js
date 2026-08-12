jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('../../../../shared/feedback/feedbackAdapter', () => ({
  showAppFeedback: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  },
}));

jest.mock('../../../auth/data/datasources/authRemoteDataSource', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    signInUser: jest.fn(),
    registerUser: jest.fn(),
    signOutUser: jest.fn(),
    getCurrentUserEmail: jest.fn(() => ''),
  })),
}));

jest.mock('../../data/datasources/notesRemoteDataSource', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    observeNotesByEmail: jest.fn(),
    addNote: jest.fn(),
    updateNote: jest.fn(),
    deleteNote: jest.fn(),
  })),
}));

import { showAppFeedback } from '../../../../shared/feedback/feedbackAdapter';
import useNotesStore from '../useNotesStore';

const resetStore = () => {
  useNotesStore.setState({
    appTheme: '#F7B518',
    textTheme: 'black',
    isLoading: true,
    isLogin: false,
    usrMail: '',
    hasInternet: null,
    notes: [],
  });
};

describe('useNotesStore business logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetStore();
  });

  it('register rejects weak passwords', async () => {
    const result = await useNotesStore.getState().register('user@test.com', 'weakpass');

    expect(result).toBe(false);
    expect(showAppFeedback).toHaveBeenCalledWith(
      'Password must be at least 8 characters and include a letter, number, and special character',
    );
  });

  it('setters update UI state', () => {
    const { setAppTheme, setTextTheme, setIsLoading } = useNotesStore.getState();

    setAppTheme('#000000');
    setTextTheme('white');
    setIsLoading(false);

    const state = useNotesStore.getState();
    expect(state.appTheme).toBe('#000000');
    expect(state.textTheme).toBe('white');
    expect(state.isLoading).toBe(false);
  });

  it('resetSession clears auth and notes data', () => {
    useNotesStore.setState({
      isLogin: true,
      usrMail: 'user@test.com',
      notes: [{ id: '1', title: 'n', description: 'd' }],
    });

    useNotesStore.getState().resetSession();

    const state = useNotesStore.getState();
    expect(state.isLogin).toBe(false);
    expect(state.usrMail).toBe('');
    expect(state.notes).toEqual([]);
  });
});

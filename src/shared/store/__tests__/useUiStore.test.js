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

jest.mock('../../feedback/feedbackAdapter', () => ({
  showAppFeedback: jest.fn(),
}));

import NetInfo from '@react-native-community/netinfo';
import { showAppFeedback } from '../../feedback/feedbackAdapter';
import useUiStore from '../useUiStore';

beforeEach(() => {
  jest.clearAllMocks();
  NetInfo.addEventListener.mockReturnValue(jest.fn());
  NetInfo.fetch.mockResolvedValue({ isConnected: true, isInternetReachable: true });
  useUiStore.setState({ appTheme: '#F7B518', textTheme: 'black', isLoading: true, hasInternet: null });
});

describe('useUiStore setters', () => {
  it('updates theme and loading flags', () => {
    const { setAppTheme, setTextTheme, setIsLoading, setHasInternet } = useUiStore.getState();

    setAppTheme('#000000');
    setTextTheme('white');
    setIsLoading(false);
    setHasInternet(true);

    expect(useUiStore.getState()).toMatchObject({
      appTheme: '#000000',
      textTheme: 'white',
      isLoading: false,
      hasInternet: true,
    });
  });

  it('showFeedback delegates to the feedback adapter', () => {
    useUiStore.getState().showFeedback('hello');
    expect(showAppFeedback).toHaveBeenCalledWith('hello');
  });
});

describe('startNetworkListener', () => {
  it('registers a NetInfo listener and returns its unsubscribe', () => {
    const unsubscribe = jest.fn();
    NetInfo.addEventListener.mockReturnValueOnce(unsubscribe);

    const stop = useUiStore.getState().startNetworkListener();

    expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
    expect(stop).toBe(unsubscribe);
  });

  it('marks the app online only when connected AND reachable', () => {
    let handler;
    NetInfo.addEventListener.mockImplementationOnce((cb) => {
      handler = cb;
      return jest.fn();
    });

    useUiStore.getState().startNetworkListener();

    handler({ isConnected: true, isInternetReachable: true });
    expect(useUiStore.getState().hasInternet).toBe(true);

    handler({ isConnected: false, isInternetReachable: true });
    expect(useUiStore.getState().hasInternet).toBe(false);

    handler({ isConnected: true, isInternetReachable: false });
    expect(useUiStore.getState().hasInternet).toBe(false);

    // NetInfo reports `null` (unknown) as "not explicitly false" -> treated as reachable
    handler({ isConnected: true, isInternetReachable: null });
    expect(useUiStore.getState().hasInternet).toBe(true);
  });

  it('applies the initial NetInfo.fetch() result', async () => {
    NetInfo.addEventListener.mockImplementationOnce(() => jest.fn());
    NetInfo.fetch.mockResolvedValueOnce({ isConnected: false, isInternetReachable: false });

    useUiStore.getState().startNetworkListener();
    await Promise.resolve();
    await Promise.resolve();

    expect(useUiStore.getState().hasInternet).toBe(false);
  });
});

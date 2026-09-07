import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('../../store/useAuthStore', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../shared/store/useUiStore', () => ({ __esModule: true, default: jest.fn() }));

jest.mock('../../../../shared/utils/logger', () => ({
  __esModule: true,
  default: { log: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

jest.mock('../../../../shared/components/Loader', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  return (props) => ReactLib.createElement(View, { testID: 'loader', ...props });
});

jest.mock('../../../../shared/components/PasswordInput', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  return (props) => ReactLib.createElement(View, { testID: 'password-input', ...props });
});

jest.mock('react-native-paper', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  return {
    TextInput: (props) => ReactLib.createElement(View, props),
    Button: (props) => ReactLib.createElement(View, props),
  };
});

import useAuthStore from '../../store/useAuthStore';
import useUiStore from '../../../../shared/store/useUiStore';
import Login from '../Login';

const mockLogin = jest.fn();
const mockShowFeedback = jest.fn();
const mockSetIsLoading = jest.fn();

let authState;
let uiState;

beforeEach(() => {
  jest.clearAllMocks();
  authState = { login: mockLogin };
  uiState = {
    appTheme: '#F7B518',
    showFeedback: mockShowFeedback,
    isLoading: false,
    setIsLoading: mockSetIsLoading,
    hasInternet: true,
  };
  useAuthStore.mockImplementation((selector) => selector(authState));
  useUiStore.mockImplementation((selector) => selector(uiState));
});

const render = () => {
  let tree;
  act(() => {
    tree = renderer.create(<Login />);
  });
  return tree;
};

const controls = (tree) => ({
  emailInput: tree.root.findByProps({ label: 'Email' }),
  passwordInput: tree.root.findByProps({ testID: 'password-input' }),
  loginButton: tree.root.find(
    (node) => typeof node.props.onPress === 'function' && node.props.children === 'LOGIN',
  ),
});

describe('Login screen', () => {
  it('submits the entered credentials to the auth store', async () => {
    const { emailInput, passwordInput, loginButton } = controls(render());

    act(() => emailInput.props.onChangeText('User@Test.com'));
    act(() => passwordInput.props.onChangeText('Password1!'));
    await act(async () => {
      await loginButton.props.onPress();
    });

    expect(mockLogin).toHaveBeenCalledWith('User@Test.com', 'Password1!');
  });

  it('blocks submission and warns when the email is empty', async () => {
    const { passwordInput, loginButton } = controls(render());

    act(() => passwordInput.props.onChangeText('Password1!'));
    await act(async () => {
      await loginButton.props.onPress();
    });

    expect(mockShowFeedback).toHaveBeenCalledWith('Email required');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('rejects a malformed email address', async () => {
    const { emailInput, passwordInput, loginButton } = controls(render());

    act(() => emailInput.props.onChangeText('not-an-email'));
    act(() => passwordInput.props.onChangeText('Password1!'));
    await act(async () => {
      await loginButton.props.onPress();
    });

    expect(mockShowFeedback).toHaveBeenCalledWith('Email not valid');
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('shows the loader instead of the form while loading', () => {
    uiState.isLoading = true;
    const tree = render();

    expect(tree.root.findAllByProps({ testID: 'loader' }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ label: 'Email' })).toHaveLength(0);
  });
});

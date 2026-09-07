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
import Register from '../Register';

const mockRegister = jest.fn();
const mockShowFeedback = jest.fn();

let authState;
let uiState;

beforeEach(() => {
  jest.clearAllMocks();
  authState = { register: mockRegister };
  uiState = { appTheme: '#F7B518', showFeedback: mockShowFeedback, isLoading: false, hasInternet: true };
  useAuthStore.mockImplementation((selector) => selector(authState));
  useUiStore.mockImplementation((selector) => selector(uiState));
});

const render = () => {
  let tree;
  act(() => {
    tree = renderer.create(<Register />);
  });
  return tree;
};

const controls = (tree) => ({
  emailInput: tree.root.findByProps({ label: 'Email' }),
  passwordInput: tree.root.findByProps({ testID: 'password-input' }),
  submit: tree.root.find(
    (node) => typeof node.props.onPress === 'function' && node.props.children === 'REGISTER',
  ),
});

describe('Register screen', () => {
  it('rejects a password that fails the policy before calling register', async () => {
    const { emailInput, passwordInput, submit } = controls(render());

    act(() => emailInput.props.onChangeText('new@test.com'));
    act(() => passwordInput.props.onChangeText('weakpass'));
    await act(async () => {
      await submit.props.onPress();
    });

    expect(mockShowFeedback).toHaveBeenCalledWith(
      'Password must be at least 8 characters and include a letter, number, and special character',
    );
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('submits a valid email + policy-compliant password', async () => {
    const { emailInput, passwordInput, submit } = controls(render());

    act(() => emailInput.props.onChangeText('new@test.com'));
    act(() => passwordInput.props.onChangeText('Password1!'));
    await act(async () => {
      await submit.props.onPress();
    });

    expect(mockRegister).toHaveBeenCalledWith('new@test.com', 'Password1!');
  });
});

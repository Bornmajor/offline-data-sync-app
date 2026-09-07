import React from 'react';
import renderer, { act } from 'react-test-renderer';

jest.mock('../../../auth/store/useAuthStore', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../shared/store/useUiStore', () => ({ __esModule: true, default: jest.fn() }));

jest.mock('@expo/vector-icons', () => ({ FontAwesome6: 'FontAwesome6' }));

jest.mock('react-native-paper', () => {
  const ReactLib = require('react');
  const { View } = require('react-native');
  return { Button: (props) => ReactLib.createElement(View, props) };
});

import { Text } from 'react-native';
import useAuthStore from '../../../auth/store/useAuthStore';
import useUiStore from '../../../../shared/store/useUiStore';
import Settings from '../Settings';

const mockLogout = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.mockImplementation((selector) =>
    selector({ logout: mockLogout, usrMail: 'user@test.com' }),
  );
  useUiStore.mockImplementation((selector) => selector({ appTheme: '#F7B518' }));
});

describe('Settings screen', () => {
  it('shows the signed-in email and logs out on button press', () => {
    let tree;
    act(() => {
      tree = renderer.create(<Settings />);
    });

    const texts = tree.root.findAllByType(Text).map((n) => n.props.children);
    expect(texts).toContain('user@test.com');

    const button = tree.root.find(
      (node) => typeof node.props.onPress === 'function' && node.props.children === 'Logout',
    );
    act(() => button.props.onPress());

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

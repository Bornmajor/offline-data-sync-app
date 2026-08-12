import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { TextInput } from 'react-native-paper';
import PasswordInput from '../PasswordInput';

jest.mock('react-native-paper', () => {
  const ReactLib = require('react');
  const { View: RNView } = require('react-native');

  const MockTextInput = (props) => <RNView {...props} />;
  MockTextInput.Icon = (props) => <RNView {...props} />;

  return {
    TextInput: MockTextInput,
  };
});

describe('PasswordInput', () => {
  it('toggles secureTextEntry when eye icon is pressed', () => {
    const onChangeText = jest.fn();
    const tree = renderer.create(
      <PasswordInput value="Password@123" onChangeText={onChangeText} activeUnderlineColor="#000" />,
    );

    const inputBefore = tree.root.findByType(TextInput);
    expect(inputBefore.props.secureTextEntry).toBe(true);

    act(() => {
      inputBefore.props.right.props.onPress();
    });

    const inputAfter = tree.root.findByType(TextInput);
    expect(inputAfter.props.secureTextEntry).toBe(false);

    expect(inputAfter.props.right.props.icon).toBe('eye-off');
  });
});

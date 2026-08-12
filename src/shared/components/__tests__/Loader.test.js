import React from 'react';
import renderer from 'react-test-renderer';
import { Text } from 'react-native';
import Loader from '../Loader';

jest.mock('react-native-paper', () => {
  const ReactLib = require('react');
  return {
    ActivityIndicator: (props) => ReactLib.createElement('ActivityIndicator', props),
  };
});

jest.mock('../../../features/notes/store/useNotesStore', () => ({
  __esModule: true,
  default: jest.fn(() => '#F7B518'),
}));

describe('Loader', () => {
  it('renders trimmed custom message', () => {
    const tree = renderer.create(<Loader msg="  Working...  " />);
    const texts = tree.root.findAllByType(Text).map((node) => node.props.children);

    expect(texts).toContain('Working...');
  });

  it('renders fallback message when msg is empty', () => {
    const tree = renderer.create(<Loader msg="   " fallbackMsg="Please wait" />);
    const texts = tree.root.findAllByType(Text).map((node) => node.props.children);

    expect(texts).toContain('Please wait');
  });
});

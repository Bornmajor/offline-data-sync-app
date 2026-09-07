import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Pressable } from 'react-native';

jest.mock('@expo/vector-icons', () => ({ AntDesign: 'AntDesign' }));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

jest.mock('../../store/useNotesStore', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../auth/store/useAuthStore', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../shared/store/useUiStore', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../../../shared/feedback/confirmDialog', () => ({ confirmAction: jest.fn() }));

import useNotesStore from '../../store/useNotesStore';
import useAuthStore from '../../../auth/store/useAuthStore';
import useUiStore from '../../../../shared/store/useUiStore';
import { confirmAction } from '../../../../shared/feedback/confirmDialog';
import NoteCard from '../NoteCard';

const mockRemoveNote = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  useNotesStore.mockImplementation((selector) => selector({ removeNote: mockRemoveNote }));
  useAuthStore.mockImplementation((selector) => selector({ usrId: 'uid-1' }));
  useUiStore.mockImplementation((selector) => selector({ appTheme: '#F7B518' }));
});

const renderCard = () => {
  let tree;
  act(() => {
    tree = renderer.create(<NoteCard id="note-1" title="Groceries" desc="milk" />);
  });
  return tree;
};

describe('NoteCard', () => {
  it('deletes the note with the owner id once the user confirms', async () => {
    confirmAction.mockResolvedValue(true);
    const tree = renderCard();
    const [deleteBtn] = tree.root.findAllByType(Pressable);

    await act(async () => {
      await deleteBtn.props.onPress();
    });

    expect(confirmAction).toHaveBeenCalledWith(
      expect.objectContaining({ confirmLabel: 'Delete', destructive: true }),
    );
    expect(mockRemoveNote).toHaveBeenCalledWith('uid-1', 'note-1');
  });

  it('does not delete when the user cancels the confirmation', async () => {
    confirmAction.mockResolvedValue(false);
    const tree = renderCard();
    const [deleteBtn] = tree.root.findAllByType(Pressable);

    await act(async () => {
      await deleteBtn.props.onPress();
    });

    expect(mockRemoveNote).not.toHaveBeenCalled();
  });

  it('opens the editor with the note payload', () => {
    confirmAction.mockResolvedValue(false);
    const tree = renderCard();
    const pressables = tree.root.findAllByType(Pressable);

    act(() => pressables[1].props.onPress());

    expect(mockNavigate).toHaveBeenCalledWith('note', {
      id: 'note-1',
      title: 'Groceries',
      desc: 'milk',
    });
  });
});

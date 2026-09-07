const mockUiState = {
  setIsLoading: jest.fn(),
  showFeedback: jest.fn(),
};

jest.mock('../../../../shared/store/useUiStore', () => ({
  __esModule: true,
  default: { getState: () => mockUiState },
}));

jest.mock('../../container', () => ({
  __esModule: true,
  observeNotesByOwner: jest.fn(),
  addNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
}));

import { addNote, deleteNote, observeNotesByOwner, updateNote } from '../../container';
import useNotesStore, { toNotesList } from '../useNotesStore';

beforeEach(() => {
  jest.clearAllMocks();
  useNotesStore.setState({ notes: [] });
});

describe('toNotesList', () => {
  it('maps a snapshot object into an array with ids', () => {
    const list = toNotesList({
      n1: { title: 'A', description: 'a' },
      n2: { title: 'B', description: 'b' },
    });

    expect(list).toEqual([
      { id: 'n1', title: 'A', description: 'a' },
      { id: 'n2', title: 'B', description: 'b' },
    ]);
  });

  it('returns an empty array for null/undefined snapshots', () => {
    expect(toNotesList(null)).toEqual([]);
    expect(toNotesList(undefined)).toEqual([]);
  });
});

describe('watchNotes', () => {
  it('subscribes for the owner and mirrors transformed snapshots into state', () => {
    const unsubscribe = jest.fn();
    let emit;
    observeNotesByOwner.mockImplementation((ownerId, onChange) => {
      emit = onChange;
      return unsubscribe;
    });

    const stop = useNotesStore.getState().watchNotes('uid-1');

    expect(observeNotesByOwner).toHaveBeenCalledWith('uid-1', expect.any(Function));
    expect(mockUiState.setIsLoading).toHaveBeenCalledWith(true);

    emit({ n1: { title: 'A', description: 'a' } });

    expect(useNotesStore.getState().notes).toEqual([{ id: 'n1', title: 'A', description: 'a' }]);
    expect(mockUiState.setIsLoading).toHaveBeenLastCalledWith(false);
    expect(stop).toBe(unsubscribe);
  });

  it('clears notes and does not subscribe when there is no owner', () => {
    const stop = useNotesStore.getState().watchNotes('');

    expect(observeNotesByOwner).not.toHaveBeenCalled();
    expect(useNotesStore.getState().notes).toEqual([]);
    expect(mockUiState.setIsLoading).toHaveBeenLastCalledWith(false);
    expect(typeof stop).toBe('function');
  });

  it('resets notes to an empty list when the snapshot is empty', () => {
    let emit;
    observeNotesByOwner.mockImplementation((ownerId, onChange) => {
      emit = onChange;
      return jest.fn();
    });
    useNotesStore.setState({ notes: [{ id: 'stale', title: 'x', description: '' }] });

    useNotesStore.getState().watchNotes('uid-1');
    emit(null);

    expect(useNotesStore.getState().notes).toEqual([]);
  });
});

describe('createNote', () => {
  it('rejects a blank title without hitting the data layer', async () => {
    const ok = await useNotesStore.getState().createNote('   ', 'body', 'uid-1');

    expect(ok).toBe(false);
    expect(addNote).not.toHaveBeenCalled();
    expect(mockUiState.showFeedback).toHaveBeenCalledWith('Note title is required.');
  });

  it('rejects when there is no owner', async () => {
    const ok = await useNotesStore.getState().createNote('Title', 'body', '');

    expect(ok).toBe(false);
    expect(addNote).not.toHaveBeenCalled();
    expect(mockUiState.showFeedback).toHaveBeenCalledWith('You must be signed in to add a note.');
  });

  it('trims the title and persists via the use case', async () => {
    addNote.mockResolvedValue('note-1');

    const ok = await useNotesStore.getState().createNote('  Groceries  ', 'milk', 'uid-1');

    expect(ok).toBe(true);
    expect(addNote).toHaveBeenCalledWith({ ownerId: 'uid-1', title: 'Groceries', description: 'milk' });
  });

  it('surfaces feedback when the write fails', async () => {
    addNote.mockRejectedValue(new Error('offline'));

    const ok = await useNotesStore.getState().createNote('Title', 'body', 'uid-1');

    expect(ok).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith(
      'Could not save the note. Check your connection.',
    );
  });
});

describe('editNote / removeNote', () => {
  it('editNote forwards owner + id and returns true on success', async () => {
    updateNote.mockResolvedValue(undefined);

    const ok = await useNotesStore.getState().editNote('uid-1', 'note-1', '  New  ', 'desc');

    expect(ok).toBe(true);
    expect(updateNote).toHaveBeenCalledWith({
      ownerId: 'uid-1',
      id: 'note-1',
      title: 'New',
      description: 'desc',
    });
  });

  it('editNote surfaces feedback when the update fails', async () => {
    updateNote.mockRejectedValue(new Error('offline'));

    const ok = await useNotesStore.getState().editNote('uid-1', 'note-1', 'New', 'desc');

    expect(ok).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith(
      'Could not update the note. Check your connection.',
    );
  });

  it('removeNote deletes by owner + id', async () => {
    deleteNote.mockResolvedValue(undefined);

    const ok = await useNotesStore.getState().removeNote('uid-1', 'note-1');

    expect(ok).toBe(true);
    expect(deleteNote).toHaveBeenCalledWith({ ownerId: 'uid-1', id: 'note-1' });
  });

  it('removeNote surfaces feedback when the delete fails', async () => {
    deleteNote.mockRejectedValue(new Error('offline'));

    const ok = await useNotesStore.getState().removeNote('uid-1', 'note-1');

    expect(ok).toBe(false);
    expect(mockUiState.showFeedback).toHaveBeenCalledWith(
      'Could not delete the note. Check your connection.',
    );
  });

  it('editNote and removeNote no-op without an owner', async () => {
    expect(await useNotesStore.getState().editNote('', 'note-1', 'x', 'y')).toBe(false);
    expect(await useNotesStore.getState().removeNote('', 'note-1')).toBe(false);
    expect(updateNote).not.toHaveBeenCalled();
    expect(deleteNote).not.toHaveBeenCalled();
  });

  it('clearNotes empties the list', () => {
    useNotesStore.setState({ notes: [{ id: '1', title: 'n', description: 'd' }] });

    useNotesStore.getState().clearNotes();

    expect(useNotesStore.getState().notes).toEqual([]);
  });
});

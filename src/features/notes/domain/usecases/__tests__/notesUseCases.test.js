import createAddNoteUseCase from '../addNoteUseCase';
import createDeleteNoteUseCase from '../deleteNoteUseCase';
import createObserveNotesByOwnerUseCase from '../observeNotesByOwnerUseCase';
import createUpdateNoteUseCase from '../updateNoteUseCase';

describe('notes use cases', () => {
  it('delegates add, update, and delete operations', async () => {
    const repository = {
      addNote: jest.fn().mockResolvedValue('note-1'),
      updateNote: jest.fn().mockResolvedValue(undefined),
      deleteNote: jest.fn().mockResolvedValue(undefined),
    };

    const addNote = createAddNoteUseCase(repository);
    const updateNote = createUpdateNoteUseCase(repository);
    const deleteNote = createDeleteNoteUseCase(repository);

    const payload = { ownerId: 'uid-1', title: 't', description: 'd' };
    const updatePayload = { ownerId: 'uid-1', id: 'note-1', title: 'new', description: 'new d' };
    const deletePayload = { ownerId: 'uid-1', id: 'note-1' };

    const key = await addNote(payload);
    await updateNote(updatePayload);
    await deleteNote(deletePayload);

    expect(repository.addNote).toHaveBeenCalledWith(payload);
    expect(repository.updateNote).toHaveBeenCalledWith(updatePayload);
    expect(repository.deleteNote).toHaveBeenCalledWith(deletePayload);
    expect(key).toBe('note-1');
  });

  it('delegates observeNotesByOwner and returns unsubscribe', () => {
    const unsubscribe = jest.fn();
    const repository = {
      observeNotesByOwner: jest.fn(() => unsubscribe),
    };

    const observeNotesByOwner = createObserveNotesByOwnerUseCase(repository);
    const listener = jest.fn();

    const stop = observeNotesByOwner('uid-1', listener);

    expect(repository.observeNotesByOwner).toHaveBeenCalledWith('uid-1', listener);
    expect(stop).toBe(unsubscribe);
  });
});

import createAddNoteUseCase from '../addNoteUseCase';
import createDeleteNoteUseCase from '../deleteNoteUseCase';
import createObserveNotesByEmailUseCase from '../observeNotesByEmailUseCase';
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

    const payload = { title: 't', description: 'd', email: 'user@test.com' };

    const key = await addNote(payload);
    await updateNote({ id: 'note-1', title: 'new', description: 'new d' });
    await deleteNote('note-1');

    expect(repository.addNote).toHaveBeenCalledWith(payload);
    expect(repository.updateNote).toHaveBeenCalledWith({ id: 'note-1', title: 'new', description: 'new d' });
    expect(repository.deleteNote).toHaveBeenCalledWith('note-1');
    expect(key).toBe('note-1');
  });

  it('delegates observeNotesByEmail and returns unsubscribe', () => {
    const unsubscribe = jest.fn();
    const repository = {
      observeNotesByEmail: jest.fn(() => unsubscribe),
    };

    const observeNotesByEmail = createObserveNotesByEmailUseCase(repository);
    const listener = jest.fn();

    const stop = observeNotesByEmail('user@test.com', listener);

    expect(repository.observeNotesByEmail).toHaveBeenCalledWith('user@test.com', listener);
    expect(stop).toBe(unsubscribe);
  });
});

import createNotesRepository from '../notesRepository';

describe('notesRepository', () => {
  it('delegates observeNotesByOwner and returns unsubscribe', () => {
    const unsubscribe = jest.fn();
    const ds = {
      observeNotesByOwner: jest.fn().mockReturnValue(unsubscribe),
      addNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
    };

    const repo = createNotesRepository(ds);
    const onChange = jest.fn();
    const result = repo.observeNotesByOwner('uid-1', onChange);

    expect(ds.observeNotesByOwner).toHaveBeenCalledWith('uid-1', onChange);
    expect(result).toBe(unsubscribe);
  });

  it('delegates addNote, updateNote, and deleteNote', async () => {
    const payload = { ownerId: 'uid-1', title: 'Title', description: 'Body' };
    const updatePayload = { ownerId: 'uid-1', id: '1', title: 'Edited', description: 'Updated body' };
    const deletePayload = { ownerId: 'uid-1', id: '1' };
    const ds = {
      observeNotesByOwner: jest.fn(),
      addNote: jest.fn().mockResolvedValue('new-key'),
      updateNote: jest.fn().mockResolvedValue(undefined),
      deleteNote: jest.fn().mockResolvedValue(undefined),
    };

    const repo = createNotesRepository(ds);

    await expect(repo.addNote(payload)).resolves.toBe('new-key');
    await expect(repo.updateNote(updatePayload)).resolves.toBeUndefined();
    await expect(repo.deleteNote(deletePayload)).resolves.toBeUndefined();

    expect(ds.addNote).toHaveBeenCalledWith(payload);
    expect(ds.updateNote).toHaveBeenCalledWith(updatePayload);
    expect(ds.deleteNote).toHaveBeenCalledWith(deletePayload);
  });
});

import createNotesRepository from '../notesRepository';

describe('notesRepository', () => {
  it('delegates observeNotesByEmail and returns unsubscribe', () => {
    const unsubscribe = jest.fn();
    const ds = {
      observeNotesByEmail: jest.fn().mockReturnValue(unsubscribe),
      addNote: jest.fn(),
      updateNote: jest.fn(),
      deleteNote: jest.fn(),
    };

    const repo = createNotesRepository(ds);
    const onChange = jest.fn();
    const result = repo.observeNotesByEmail('user@test.com', onChange);

    expect(ds.observeNotesByEmail).toHaveBeenCalledWith('user@test.com', onChange);
    expect(result).toBe(unsubscribe);
  });

  it('delegates addNote, updateNote, and deleteNote', async () => {
    const payload = { title: 'Title', description: 'Body', email: 'user@test.com' };
    const updatePayload = { id: '1', title: 'Edited', description: 'Updated body' };
    const ds = {
      observeNotesByEmail: jest.fn(),
      addNote: jest.fn().mockResolvedValue('new-key'),
      updateNote: jest.fn().mockResolvedValue(undefined),
      deleteNote: jest.fn().mockResolvedValue(undefined),
    };

    const repo = createNotesRepository(ds);

    await expect(repo.addNote(payload)).resolves.toBe('new-key');
    await expect(repo.updateNote(updatePayload)).resolves.toBeUndefined();
    await expect(repo.deleteNote('1')).resolves.toBeUndefined();

    expect(ds.addNote).toHaveBeenCalledWith(payload);
    expect(ds.updateNote).toHaveBeenCalledWith(updatePayload);
    expect(ds.deleteNote).toHaveBeenCalledWith('1');
  });
});

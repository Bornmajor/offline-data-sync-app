jest.mock('firebase/database', () => ({
  onValue: jest.fn(),
  push: jest.fn(),
  ref: jest.fn((db, path) => ({ db, path })),
  remove: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../../../shared/firebase/firebaseClient', () => ({
  getFirebaseDatabase: jest.fn(),
}));

import { onValue, push, ref, remove, set, update } from 'firebase/database';
import { getFirebaseDatabase } from '../../../../../shared/firebase/firebaseClient';
import createNotesRemoteDataSource from '../notesRemoteDataSource';

describe('notesRemoteDataSource', () => {
  const db = { app: 'db' };

  beforeEach(() => {
    jest.clearAllMocks();
    getFirebaseDatabase.mockReturnValue(db);
  });

  it('observeNotesByOwner subscribes to the owner subtree and forwards snapshot data', () => {
    const unsubscribe = jest.fn();
    const snapshot = { val: jest.fn(() => ({ a: { title: 't' } })) };
    onValue.mockImplementation((_ref, callback) => {
      callback(snapshot);
      return unsubscribe;
    });

    const onChange = jest.fn();
    const ds = createNotesRemoteDataSource();

    const stop = ds.observeNotesByOwner('uid-1', onChange);

    expect(ref).toHaveBeenCalledWith(db, 'notes/uid-1');
    expect(onChange).toHaveBeenCalledWith({ a: { title: 't' } });
    expect(stop).toBe(unsubscribe);
  });

  it('addNote pushes into the owner subtree and returns the key', async () => {
    const newRef = { key: 'note-1' };
    push.mockReturnValue(newRef);
    set.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    const key = await ds.addNote({ ownerId: 'uid-1', title: 't', description: 'd' });

    expect(push).toHaveBeenCalledWith({ db, path: 'notes/uid-1' });
    expect(set).toHaveBeenCalledWith(newRef, { title: 't', description: 'd' });
    expect(key).toBe('note-1');
  });

  it('updateNote updates mutable fields under the owner subtree', async () => {
    update.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    await ds.updateNote({ ownerId: 'uid-1', id: 'abc', title: 'new', description: 'desc' });

    expect(ref).toHaveBeenCalledWith(db, 'notes/uid-1/abc');
    expect(update).toHaveBeenCalledWith(
      { db, path: 'notes/uid-1/abc' },
      { title: 'new', description: 'desc' },
    );
  });

  it('deleteNote removes by owner + id', async () => {
    remove.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    await ds.deleteNote({ ownerId: 'uid-1', id: 'abc' });

    expect(ref).toHaveBeenCalledWith(db, 'notes/uid-1/abc');
    expect(remove).toHaveBeenCalledWith({ db, path: 'notes/uid-1/abc' });
  });
});

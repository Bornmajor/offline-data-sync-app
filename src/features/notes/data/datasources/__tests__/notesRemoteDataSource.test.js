jest.mock('firebase/database', () => ({
  equalTo: jest.fn((value) => ({ type: 'equalTo', value })),
  onValue: jest.fn(),
  orderByChild: jest.fn((value) => ({ type: 'orderByChild', value })),
  push: jest.fn(),
  query: jest.fn((...args) => ({ args })),
  ref: jest.fn((db, path) => ({ db, path })),
  remove: jest.fn(),
  set: jest.fn(),
  update: jest.fn(),
}));

jest.mock('../../../../../shared/firebase/firebaseClient', () => ({
  getFirebaseDatabase: jest.fn(),
}));

import {
  equalTo,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from 'firebase/database';
import { getFirebaseDatabase } from '../../../../../shared/firebase/firebaseClient';
import createNotesRemoteDataSource from '../notesRemoteDataSource';

describe('notesRemoteDataSource', () => {
  const db = { app: 'db' };

  beforeEach(() => {
    jest.clearAllMocks();
    getFirebaseDatabase.mockReturnValue(db);
  });

  it('observeNotesByEmail wires query and forwards snapshot data', () => {
    const unsubscribe = jest.fn();
    const snapshot = { val: jest.fn(() => ({ a: { title: 't' } })) };
    onValue.mockImplementation((_queryRef, callback) => {
      callback(snapshot);
      return unsubscribe;
    });

    const onChange = jest.fn();
    const ds = createNotesRemoteDataSource();

    const stop = ds.observeNotesByEmail('user@test.com', onChange);

    expect(ref).toHaveBeenCalledWith(db, '/notes');
    expect(orderByChild).toHaveBeenCalledWith('email');
    expect(equalTo).toHaveBeenCalledWith('user@test.com');
    expect(query).toHaveBeenCalled();
    expect(onValue).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith({ a: { title: 't' } });
    expect(stop).toBe(unsubscribe);
  });

  it('addNote creates a pushed note and returns key', async () => {
    const newRef = { key: 'note-1' };
    push.mockReturnValue(newRef);
    set.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    const key = await ds.addNote({ title: 't', description: 'd', email: 'user@test.com' });

    expect(push).toHaveBeenCalledWith({ db, path: '/notes' });
    expect(set).toHaveBeenCalledWith(newRef, {
      title: 't',
      description: 'd',
      email: 'user@test.com',
    });
    expect(key).toBe('note-1');
  });

  it('updateNote updates mutable fields', async () => {
    update.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    await ds.updateNote({ id: 'abc', title: 'new', description: 'desc' });

    expect(ref).toHaveBeenCalledWith(db, '/notes/abc');
    expect(update).toHaveBeenCalledWith({ db, path: '/notes/abc' }, { title: 'new', description: 'desc' });
  });

  it('deleteNote removes by id', async () => {
    remove.mockResolvedValue(undefined);
    const ds = createNotesRemoteDataSource();

    await ds.deleteNote('abc');

    expect(ref).toHaveBeenCalledWith(db, '/notes/abc');
    expect(remove).toHaveBeenCalledWith({ db, path: '/notes/abc' });
  });
});

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
import { getFirebaseDatabase } from '../../../../shared/firebase/firebaseClient';

/**
 * Creates the notes data source used for note CRUD and subscriptions.
 */
const createNotesRemoteDataSource = () => ({
  /**
   * Subscribes to all notes that belong to the given email.
   * @param {string} email - The email to filter notes by.
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Callback invoked when the note list changes.
   * @returns {() => void} Unsubscribe function for the database listener.
   */
  observeNotesByEmail: (email, onChange) => {
    const db = getFirebaseDatabase();
    const notesQuery = query(ref(db, '/notes'), orderByChild('email'), equalTo(email));

    return onValue(notesQuery, (snapshot) => {
      onChange(snapshot.val());
    });
  },
  /**
   * Adds a note to the database.
   * @param {{ title: string, description: string, email: string }} payload - Note data to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  addNote: async ({ title, description, email }) => {
    const db = getFirebaseDatabase();
    const newNoteRef = push(ref(db, '/notes'));
    await set(newNoteRef, { title, description, email });
    return newNoteRef.key;
  },
  /**
   * Updates an existing note.
   * @param {{ id: string, title: string, description: string }} payload - The note id and updated fields.
   * @returns {Promise<void>}
   */
  updateNote: async ({ id, title, description }) => {
    const db = getFirebaseDatabase();
    await update(ref(db, `/notes/${id}`), { title, description });
  },
  /**
   * Deletes a note by id.
   * @param {string} id - The note id to remove.
   * @returns {Promise<void>}
   */
  deleteNote: async (id) => {
    const db = getFirebaseDatabase();
    await remove(ref(db, `/notes/${id}`));
  },
});

export default createNotesRemoteDataSource;

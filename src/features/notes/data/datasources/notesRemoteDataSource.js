import { onValue, push, ref, remove, set, update } from 'firebase/database';
import { getFirebaseDatabase } from '../../../../shared/firebase/firebaseClient';

/**
 * Creates the notes data source used for note CRUD and subscriptions.
 *
 * Notes are stored under an owner-scoped subtree: `/notes/{ownerId}/{noteId}`,
 * where `ownerId` is the Firebase `auth.uid`. The matching Realtime Database
 * rules in `database.rules.json` grant read/write on `/notes/{ownerId}` only
 * when `auth.uid === ownerId`, so a user can never read or query another
 * user's notes — isolation is enforced by the server, not by client filtering.
 */
const createNotesRemoteDataSource = () => ({
  /**
   * Subscribes to all notes that belong to the given owner.
   * @param {string} ownerId - The owner id (Firebase `auth.uid`).
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Callback invoked when the note list changes.
   * @returns {() => void} Unsubscribe function for the database listener.
   */
  observeNotesByOwner: (ownerId, onChange) => {
    const db = getFirebaseDatabase();

    return onValue(ref(db, `notes/${ownerId}`), (snapshot) => {
      onChange(snapshot.val());
    });
  },
  /**
   * Adds a note under the owner's subtree.
   * @param {{ ownerId: string, title: string, description: string }} payload - Note data to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  addNote: async ({ ownerId, title, description }) => {
    const db = getFirebaseDatabase();
    const newNoteRef = push(ref(db, `notes/${ownerId}`));
    await set(newNoteRef, { title, description });
    return newNoteRef.key;
  },
  /**
   * Updates an existing note.
   * @param {{ ownerId: string, id: string, title: string, description: string }} payload - The note id and updated fields.
   * @returns {Promise<void>}
   */
  updateNote: async ({ ownerId, id, title, description }) => {
    const db = getFirebaseDatabase();
    await update(ref(db, `notes/${ownerId}/${id}`), { title, description });
  },
  /**
   * Deletes a note by id.
   * @param {{ ownerId: string, id: string }} payload - The owner and note id to remove.
   * @returns {Promise<void>}
   */
  deleteNote: async ({ ownerId, id }) => {
    const db = getFirebaseDatabase();
    await remove(ref(db, `notes/${ownerId}/${id}`));
  },
});

export default createNotesRemoteDataSource;

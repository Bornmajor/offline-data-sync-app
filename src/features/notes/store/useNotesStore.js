import { create } from 'zustand';
import useUiStore from '../../../shared/store/useUiStore';
import logger from '../../../shared/utils/logger';
import { addNote, deleteNote, observeNotesByOwner, updateNote } from '../container';

/**
 * @typedef {{ id: string, title: string, description: string }} Note
 */

/**
 * Converts a Realtime Database snapshot object into the array shape the UI renders.
 * @param {Record<string, Omit<Note, 'id'>> | null | undefined} snapshot
 * @returns {Note[]}
 */
export const toNotesList = (snapshot) => {
  if (!snapshot) {
    return [];
  }

  return Object.keys(snapshot).map((key) => ({ id: key, ...snapshot[key] }));
};

/**
 * Notes domain state. Holds the current note list and the actions screens call;
 * connectivity and feedback come from the UI store, identity from the auth store.
 */
const useNotesStore = create((set) => ({
  /** @type {Note[]} */
  notes: [],
  /** Clears the in-memory note list (used on sign-out). */
  clearNotes: () => set({ notes: [] }),
  /**
   * Subscribes to the signed-in user's notes and mirrors them into the store.
   * @param {string} ownerId - The owner id (Firebase `auth.uid`).
   * @returns {() => void} Unsubscribe function.
   */
  watchNotes: (ownerId) => {
    const ui = useUiStore.getState();
    ui.setIsLoading(true);

    if (!ownerId) {
      set({ notes: [] });
      ui.setIsLoading(false);
      return () => {};
    }

    return observeNotesByOwner(ownerId, (snapshot) => {
      set({ notes: toNotesList(snapshot) });
      ui.setIsLoading(false);
    });
  },
  /**
   * Creates a note for the given owner.
   * @param {string} title
   * @param {string} description
   * @param {string} ownerId
   * @returns {Promise<boolean>} True when the note was persisted.
   */
  createNote: async (title, description, ownerId) => {
    const ui = useUiStore.getState();
    const trimmedTitle = (title ?? '').trim();

    if (!trimmedTitle) {
      ui.showFeedback('Note title is required.');
      return false;
    }

    if (!ownerId) {
      ui.showFeedback('You must be signed in to add a note.');
      return false;
    }

    try {
      await addNote({ ownerId, title: trimmedTitle, description: description ?? '' });
      return true;
    } catch (error) {
      logger.error('Create note failed', error);
      ui.showFeedback('Could not save the note. Check your connection.');
      return false;
    }
  },
  /**
   * Updates an existing note.
   * @param {string} ownerId
   * @param {string} id
   * @param {string} title
   * @param {string} description
   * @returns {Promise<boolean>} True when the update was persisted.
   */
  editNote: async (ownerId, id, title, description) => {
    const ui = useUiStore.getState();

    if (!ownerId) {
      return false;
    }

    try {
      await updateNote({ ownerId, id, title: (title ?? '').trim(), description: description ?? '' });
      return true;
    } catch (error) {
      logger.error('Edit note failed', error);
      ui.showFeedback('Could not update the note. Check your connection.');
      return false;
    }
  },
  /**
   * Deletes a note by id.
   * @param {string} ownerId
   * @param {string} id
   * @returns {Promise<boolean>} True when the delete was persisted.
   */
  removeNote: async (ownerId, id) => {
    const ui = useUiStore.getState();

    if (!ownerId) {
      return false;
    }

    try {
      await deleteNote({ ownerId, id });
      return true;
    } catch (error) {
      logger.error('Remove note failed', error);
      ui.showFeedback('Could not delete the note. Check your connection.');
      return false;
    }
  },
}));

export default useNotesStore;

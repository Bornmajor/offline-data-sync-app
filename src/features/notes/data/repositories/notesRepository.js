/**
 * Wraps the notes data source behind a repository boundary.
 * @param {ReturnType<import('../datasources/notesRemoteDataSource').default>} notesRemoteDataSource - The notes data source instance.
 * @returns {{ observeNotesByOwner: Function, addNote: Function, updateNote: Function, deleteNote: Function }} Repository API.
 */
const createNotesRepository = (notesRemoteDataSource) => ({
  /**
   * Subscribes to notes for one owner.
   * @param {string} ownerId - The owner id to filter notes by.
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Listener invoked on updates.
   * @returns {() => void} Unsubscribe function.
   */
  observeNotesByOwner: (ownerId, onChange) =>
    notesRemoteDataSource.observeNotesByOwner(ownerId, onChange),
  /**
   * Persists a new note.
   * @param {{ ownerId: string, title: string, description: string }} payload - Note payload to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  addNote: (payload) => notesRemoteDataSource.addNote(payload),
  /**
   * Updates a note.
   * @param {{ ownerId: string, id: string, title: string, description: string }} payload - The note identifier and edited values.
   * @returns {Promise<void>}
   */
  updateNote: (payload) => notesRemoteDataSource.updateNote(payload),
  /**
   * Removes a note.
   * @param {{ ownerId: string, id: string }} payload - The owner and note id to delete.
   * @returns {Promise<void>}
   */
  deleteNote: (payload) => notesRemoteDataSource.deleteNote(payload),
});

export default createNotesRepository;

/**
 * Wraps the notes data source behind a repository boundary.
 * @param {ReturnType<import('../datasources/notesRemoteDataSource').default>} notesRemoteDataSource - The notes data source instance.
 * @returns {{ observeNotesByEmail: Function, addNote: Function, updateNote: Function, deleteNote: Function }} Repository API.
 */
const createNotesRepository = (notesRemoteDataSource) => ({
  /**
   * Subscribes to notes for one email.
   * @param {string} email - The email to filter notes by.
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Listener invoked on updates.
   * @returns {() => void} Unsubscribe function.
   */
  observeNotesByEmail: (email, onChange) => notesRemoteDataSource.observeNotesByEmail(email, onChange),
  /**
   * Persists a new note.
   * @param {{ title: string, description: string, email: string }} payload - Note payload to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  addNote: (payload) => notesRemoteDataSource.addNote(payload),
  /**
   * Updates a note.
   * @param {{ id: string, title: string, description: string }} payload - The note identifier and edited values.
   * @returns {Promise<void>}
   */
  updateNote: (payload) => notesRemoteDataSource.updateNote(payload),
  /**
   * Removes a note.
   * @param {string} id - The note id to delete.
   * @returns {Promise<void>}
   */
  deleteNote: (id) => notesRemoteDataSource.deleteNote(id),
});

export default createNotesRepository;

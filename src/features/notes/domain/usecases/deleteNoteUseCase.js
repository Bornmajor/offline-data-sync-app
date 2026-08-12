/**
 * Builds the delete-note use case.
 * @param {{ deleteNote: (id: string) => Promise<void> }} notesRepository - The notes repository.
 * @returns {(id: string) => Promise<void>} Delete-note executor.
 */
const createDeleteNoteUseCase = (notesRepository) =>
  /**
   * Deletes a note by id.
   * @param {string} id - The note id to remove.
   * @returns {Promise<void>}
   */
  (id) => notesRepository.deleteNote(id);

export default createDeleteNoteUseCase;

/**
 * Builds the delete-note use case.
 * @param {{ deleteNote: (payload: { ownerId: string, id: string }) => Promise<void> }} notesRepository - The notes repository.
 * @returns {(payload: { ownerId: string, id: string }) => Promise<void>} Delete-note executor.
 */
const createDeleteNoteUseCase = (notesRepository) =>
  /**
   * Deletes a note by id.
   * @param {{ ownerId: string, id: string }} payload - The owner and note id to remove.
   * @returns {Promise<void>}
   */
  (payload) => notesRepository.deleteNote(payload);

export default createDeleteNoteUseCase;

/**
 * Builds the update-note use case.
 * @param {{ updateNote: (payload: { ownerId: string, id: string, title: string, description: string }) => Promise<void> }} notesRepository - The notes repository.
 * @returns {(payload: { ownerId: string, id: string, title: string, description: string }) => Promise<void>} Update-note executor.
 */
const createUpdateNoteUseCase = (notesRepository) =>
  /**
   * Updates a note using the repository layer.
   * @param {{ ownerId: string, id: string, title: string, description: string }} payload - The note id and updated fields.
   * @returns {Promise<void>}
   */
  (payload) => notesRepository.updateNote(payload);

export default createUpdateNoteUseCase;

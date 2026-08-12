/**
 * Builds the update-note use case.
 * @param {{ updateNote: (payload: { id: string, title: string, description: string }) => Promise<void> }} notesRepository - The notes repository.
 * @returns {(payload: { id: string, title: string, description: string }) => Promise<void>} Update-note executor.
 */
const createUpdateNoteUseCase = (notesRepository) =>
  /**
   * Updates a note using the repository layer.
   * @param {{ id: string, title: string, description: string }} payload - The note id and updated fields.
   * @returns {Promise<void>}
   */
  (payload) => notesRepository.updateNote(payload);

export default createUpdateNoteUseCase;

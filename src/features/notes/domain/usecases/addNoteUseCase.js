/**
 * Builds the add-note use case.
 * @param {{ addNote: (payload: { ownerId: string, title: string, description: string }) => Promise<string | null> }} notesRepository - The notes repository.
 * @returns {(payload: { ownerId: string, title: string, description: string }) => Promise<string | null>} Add-note executor.
 */
const createAddNoteUseCase = (notesRepository) =>
  /**
   * Adds a note using the repository layer.
   * @param {{ ownerId: string, title: string, description: string }} payload - Note data to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  (payload) => notesRepository.addNote(payload);

export default createAddNoteUseCase;

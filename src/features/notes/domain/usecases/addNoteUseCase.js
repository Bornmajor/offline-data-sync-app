/**
 * Builds the add-note use case.
 * @param {{ addNote: (payload: { title: string, description: string, email: string }) => Promise<string | null> }} notesRepository - The notes repository.
 * @returns {(payload: { title: string, description: string, email: string }) => Promise<string | null>} Add-note executor.
 */
const createAddNoteUseCase = (notesRepository) =>
  /**
   * Adds a note using the repository layer.
   * @param {{ title: string, description: string, email: string }} payload - Note data to persist.
   * @returns {Promise<string | null>} The created note key.
   */
  (payload) => notesRepository.addNote(payload);

export default createAddNoteUseCase;

/**
 * Builds the note subscription use case.
 * @param {{ observeNotesByOwner: (ownerId: string, onChange: (notes: Record<string, unknown> | null) => void) => () => void }} notesRepository - The notes repository.
 * @returns {(ownerId: string, onChange: (notes: Record<string, unknown> | null) => void) => () => void} Subscription executor.
 */
const createObserveNotesByOwnerUseCase = (notesRepository) =>
  /**
   * Observes note changes for a given owner.
   * @param {string} ownerId - The owner id to filter notes by.
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Listener invoked on updates.
   * @returns {() => void} Unsubscribe function.
   */
  (ownerId, onChange) => notesRepository.observeNotesByOwner(ownerId, onChange);

export default createObserveNotesByOwnerUseCase;

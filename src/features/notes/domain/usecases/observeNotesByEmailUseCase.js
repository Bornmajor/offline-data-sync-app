/**
 * Builds the note subscription use case.
 * @param {{ observeNotesByEmail: (email: string, onChange: (notes: Record<string, unknown> | null) => void) => () => void }} notesRepository - The notes repository.
 * @returns {(email: string, onChange: (notes: Record<string, unknown> | null) => void) => () => void} Subscription executor.
 */
const createObserveNotesByEmailUseCase = (notesRepository) =>
  /**
   * Observes note changes for a given email.
   * @param {string} email - The email to filter notes by.
   * @param {(notes: Record<string, unknown> | null) => void} onChange - Listener invoked on updates.
   * @returns {() => void} Unsubscribe function.
   */
  (email, onChange) => notesRepository.observeNotesByEmail(email, onChange);

export default createObserveNotesByEmailUseCase;

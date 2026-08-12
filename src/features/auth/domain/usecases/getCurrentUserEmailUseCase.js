/**
 * Builds the auth session lookup use case.
 * @param {{ getCurrentUserEmail: () => string }} authRepository - The auth repository.
 * @returns {() => string} Current user email reader.
 */
const createGetCurrentUserEmailUseCase = (authRepository) =>
  /**
   * Reads the current authenticated email.
   * @returns {string}
   */
  () => authRepository.getCurrentUserEmail();

export default createGetCurrentUserEmailUseCase;

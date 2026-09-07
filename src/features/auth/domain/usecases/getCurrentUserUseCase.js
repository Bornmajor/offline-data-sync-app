/**
 * Builds the auth session lookup use case.
 * @param {{ getCurrentUser: () => ({ uid: string, email: string } | null) }} authRepository - The auth repository.
 * @returns {() => ({ uid: string, email: string } | null)} Current user reader.
 */
const createGetCurrentUserUseCase = (authRepository) =>
  /**
   * Reads the current authenticated user.
   * @returns {{ uid: string, email: string } | null}
   */
  () => authRepository.getCurrentUser();

export default createGetCurrentUserUseCase;

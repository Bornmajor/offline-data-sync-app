/**
 * Builds the auth sign-out use case.
 * @param {{ signOutUser: () => Promise<void> }} authRepository - The auth repository.
 * @returns {() => Promise<void>} Sign-out executor.
 */
const createSignOutUserUseCase = (authRepository) =>
  /**
   * Signs out the active user.
   * @returns {Promise<void>}
   */
  () => authRepository.signOutUser();

export default createSignOutUserUseCase;

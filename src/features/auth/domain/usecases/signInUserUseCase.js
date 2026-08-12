/**
 * Builds the sign-in use case.
 * @param {{ signInUser: (email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }> }} authRepository - The auth repository.
 * @returns {(email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }>} Sign-in executor.
 */
const createSignInUserUseCase = (authRepository) =>
  /**
   * Executes sign in.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>}
   */
  async (email, password) => authRepository.signInUser(email, password);

export default createSignInUserUseCase;

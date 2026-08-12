/**
 * Builds the auth use case that the UI/store can call.
 * @param {{ signInOrRegisterUser: (email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }> }} authRepository - The auth repository.
 * @returns {(email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }>} Sign-in or registration executor.
 */
const createSignInOrRegisterUserUseCase = (authRepository) =>
  /**
   * Executes the sign-in-or-register flow.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>}
   */
  async (email, password) => authRepository.signInOrRegisterUser(email, password);

export default createSignInOrRegisterUserUseCase;

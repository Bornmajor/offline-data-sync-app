/**
 * Builds the registration use case.
 * @param {{ registerUser: (email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }> }} authRepository - The auth repository.
 * @returns {(email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }>} Register executor.
 */
const createRegisterUserUseCase = (authRepository) =>
  /**
   * Executes account registration.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>}
   */
  async (email, password) => authRepository.registerUser(email, password);

export default createRegisterUserUseCase;

/**
 * Builds the sign-in use case.
 * @param {{ signInUser: (email: string, password: string) => Promise<import('../../data/datasources/authRemoteDataSource').AuthResult> }} authRepository - The auth repository.
 * @returns {(email: string, password: string) => Promise<import('../../data/datasources/authRemoteDataSource').AuthResult>} Sign-in executor.
 */
const createSignInUserUseCase = (authRepository) =>
  /**
   * Executes sign in.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('../../data/datasources/authRemoteDataSource').AuthResult>}
   */
  async (email, password) => authRepository.signInUser(email, password);

export default createSignInUserUseCase;

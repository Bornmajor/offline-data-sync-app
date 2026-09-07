/**
 * Builds the registration use case.
 * @param {{ registerUser: (email: string, password: string) => Promise<import('../../data/datasources/authRemoteDataSource').AuthResult> }} authRepository - The auth repository.
 * @returns {(email: string, password: string) => Promise<import('../../data/datasources/authRemoteDataSource').AuthResult>} Register executor.
 */
const createRegisterUserUseCase = (authRepository) =>
  /**
   * Executes account registration.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('../../data/datasources/authRemoteDataSource').AuthResult>}
   */
  async (email, password) => authRepository.registerUser(email, password);

export default createRegisterUserUseCase;

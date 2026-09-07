/**
 * Wraps the auth data source behind a repository boundary.
 * @param {ReturnType<import('../datasources/authRemoteDataSource').default>} authRemoteDataSource - The auth data source instance.
 * @returns {{
 *   signInUser: (email: string, password: string) => Promise<import('../datasources/authRemoteDataSource').AuthResult>,
 *   registerUser: (email: string, password: string) => Promise<import('../datasources/authRemoteDataSource').AuthResult>,
 *   signOutUser: () => Promise<void>,
 *   getCurrentUser: () => ({ uid: string, email: string } | null)
 * }} Repository API.
 */
const createAuthRepository = (authRemoteDataSource) => ({
  /**
   * Delegates sign in to the remote data source.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('../datasources/authRemoteDataSource').AuthResult>} Auth result.
   */
  signInUser: (email, password) => authRemoteDataSource.signInUser(email, password),
  /**
   * Delegates registration to the remote data source.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<import('../datasources/authRemoteDataSource').AuthResult>} Registration result.
   */
  registerUser: (email, password) => authRemoteDataSource.registerUser(email, password),
  /**
   * Delegates sign out to the remote data source.
   * @returns {Promise<void>}
   */
  signOutUser: () => authRemoteDataSource.signOutUser(),
  /**
   * Reads the current authenticated user.
   * @returns {{ uid: string, email: string } | null}
   */
  getCurrentUser: () => authRemoteDataSource.getCurrentUser(),
});

export default createAuthRepository;

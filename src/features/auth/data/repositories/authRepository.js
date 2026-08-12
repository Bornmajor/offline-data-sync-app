/**
 * Wraps the auth data source behind a repository boundary.
 * @param {ReturnType<import('../datasources/authRemoteDataSource').default>} authRemoteDataSource - The auth data source instance.
 * @returns {{ signInUser: (email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }>, registerUser: (email: string, password: string) => Promise<{ ok: boolean, email?: string, reason?: string }>, signOutUser: () => Promise<void>, getCurrentUserEmail: () => string }} Repository API.
 */
const createAuthRepository = (authRemoteDataSource) => ({
  /**
   * Delegates sign in to the remote data source.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>} Auth result.
   */
  signInUser: (email, password) => authRemoteDataSource.signInUser(email, password),
  /**
   * Delegates registration to the remote data source.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>} Registration result.
   */
  registerUser: (email, password) => authRemoteDataSource.registerUser(email, password),
  /**
   * Delegates sign out to the remote data source.
   * @returns {Promise<void>}
   */
  signOutUser: () => authRemoteDataSource.signOutUser(),
  /**
   * Reads the current authenticated user's email.
   * @returns {string}
   */
  getCurrentUserEmail: () => authRemoteDataSource.getCurrentUserEmail(),
});

export default createAuthRepository;

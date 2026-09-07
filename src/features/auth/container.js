import createAuthRemoteDataSource from './data/datasources/authRemoteDataSource';
import createAuthRepository from './data/repositories/authRepository';
import createGetCurrentUserUseCase from './domain/usecases/getCurrentUserUseCase';
import createRegisterUserUseCase from './domain/usecases/registerUserUseCase';
import createSignInUserUseCase from './domain/usecases/signInUserUseCase';
import createSignOutUserUseCase from './domain/usecases/signOutUserUseCase';

/**
 * Composition root for the auth feature.
 *
 * Wires the data source -> repository -> use case chain once so the store layer
 * depends only on ready-to-call use cases, not on how they are assembled.
 */
const authRemoteDataSource = createAuthRemoteDataSource();
const authRepository = createAuthRepository(authRemoteDataSource);

export const signInUser = createSignInUserUseCase(authRepository);
export const registerUser = createRegisterUserUseCase(authRepository);
export const signOutUser = createSignOutUserUseCase(authRepository);
export const getCurrentUser = createGetCurrentUserUseCase(authRepository);

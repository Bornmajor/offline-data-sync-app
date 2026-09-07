import createNotesRemoteDataSource from './data/datasources/notesRemoteDataSource';
import createNotesRepository from './data/repositories/notesRepository';
import createAddNoteUseCase from './domain/usecases/addNoteUseCase';
import createDeleteNoteUseCase from './domain/usecases/deleteNoteUseCase';
import createObserveNotesByOwnerUseCase from './domain/usecases/observeNotesByOwnerUseCase';
import createUpdateNoteUseCase from './domain/usecases/updateNoteUseCase';

/**
 * Composition root for the notes feature.
 *
 * Wires the data source -> repository -> use case chain once so the store layer
 * depends only on ready-to-call use cases, not on how they are assembled.
 */
const notesRemoteDataSource = createNotesRemoteDataSource();
const notesRepository = createNotesRepository(notesRemoteDataSource);

export const observeNotesByOwner = createObserveNotesByOwnerUseCase(notesRepository);
export const addNote = createAddNoteUseCase(notesRepository);
export const updateNote = createUpdateNoteUseCase(notesRepository);
export const deleteNote = createDeleteNoteUseCase(notesRepository);

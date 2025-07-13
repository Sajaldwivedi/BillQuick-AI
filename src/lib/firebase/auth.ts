
import { auth } from './config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  type UserCredential
} from 'firebase/auth';

export const signUpWithEmail = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email: string, password: string): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }
  return signInWithEmailAndPassword(auth, email, password);
};

export const signInWithGoogle = (): Promise<UserCredential> => {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export const signOutUser = (): Promise<void> => {
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }
  return signOut(auth);
};

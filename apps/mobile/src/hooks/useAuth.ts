import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useAppDispatch } from '../store/hooks';
import { setUser, setToken } from '../store/authSlice';

export function useAuthStateListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        dispatch(
          setUser({
            user: {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            },
            token,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);
}

export async function signIn(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export async function signOut() {
  return auth().signOut();
}

export async function refreshToken() {
  const user = auth().currentUser;
  if (user) {
    return user.getIdToken(true);
  }
  return null;
}

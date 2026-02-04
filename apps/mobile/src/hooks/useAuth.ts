import { useEffect } from "react";
import { getAuth } from "@react-native-firebase/auth";
import { useAppDispatch } from "../store/hooks";
import { setUser, setToken } from "../store/authSlice";
import firebase from "@react-native-firebase/app";

export function useAuthStateListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(async (firebaseUser) => {
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
          }),
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, [dispatch]);
}

export async function signIn(email: string, password: string) {
  return getAuth().signInWithEmailAndPassword(email, password);
}

export async function signUp(email: string, password: string) {
  return getAuth().createUserWithEmailAndPassword(email, password);
}

export async function signOut() {
  return getAuth().signOut();
}

export async function refreshToken() {
  const user = getAuth().currentUser;

  if (user) {
    return user.getIdToken(true);
  }

  return null;
}

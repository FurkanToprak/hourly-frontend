import {
  getAuth, GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth';
import React, { createContext, useContext, useState } from 'react';
import { provider } from '../connections/Firebase';

export const AuthContext = createContext([{}, () => { /** Satisfy lint */ }] as [any, any]);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userState, setUserState] = useContext(AuthContext);

  function loginWithGoogle() {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const token = credential.accessToken;
        if (!token) {
          return;
        }
        // The signed-in user info.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user } = result;
      }).catch(() => {
        // TODO:
      });
  }

  function signOut() {
    setUserState(null);
  }

  return {
    loginWithGoogle,
    signOut,
    user: userState,
  };
};

import {
  getAuth, GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth';
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { provider } from '../connections/Firebase';
import FlaskClient from '../connections/Flask';

export const AuthContext = createContext([{}, () => { /** Satisfy lint */ }] as [any, any]);

interface HourlyUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null as null | HourlyUser);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [userState, setUserState] = useContext(AuthContext);

  function loginWithGoogle(onFailure: () => void) {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          onFailure();
          return;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const token = credential.idToken;
        if (!token) {
          onFailure();
          return;
        }
        // The signed-in user info.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { user } = result;
        const authResponse = await FlaskClient.post('google_auth', {
          token,
          name: auth.name,
        });
        if (authResponse) {
          setUserState({
            email: user.email,
            name: auth.name,
            id: authResponse.id,
            refreshToken: user.refreshToken,
            accessToken: token,
          });
        } else {
          onFailure();
          setUserState(null);
        }
      }).catch(() => {
        setUserState(null);
        onFailure();
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

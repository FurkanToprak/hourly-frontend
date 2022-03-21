import {
  getAuth, GoogleAuthProvider, signInWithPopup,
} from 'firebase/auth';
import React, {
  createContext, useContext, useMemo, useState,
} from 'react';
import { provider } from '../connections/Firebase';
import FlaskClient from '../connections/Flask';

interface HourlyUser {
  id: string;
  name: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextSchema {
  user: HourlyUser | null;
  logInWithGoogle: (onSuccess: () => void, onFailure: () => void) => void;
  signOut: () => void;
  isLoggedIn: boolean;
}

export const AuthContext = createContext<AuthContextSchema>({} as AuthContextSchema);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any) {
  const [hourlyUser, setHourlyUser] = useState(null as null | HourlyUser);

  function logInWithGoogle(onSuccess: () => void, onFailure: () => void) {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          onFailure();
          return;
        }
        const token = credential.idToken;
        if (!token) {
          onFailure();
          return;
        }
        // The signed-in user info.
        const { user } = result;
        // broken?
        const authResponse = await FlaskClient.post('google_auth', {
          token,
          name: auth.name,
        });
        if (authResponse) {
          setHourlyUser({
            email: user.email || '',
            name: user.displayName || user.email || '',
            id: authResponse.id,
            refreshToken: user.refreshToken,
            accessToken: token,
          });
          onSuccess();
        } else {
          onFailure();
          setHourlyUser(null);
        }
      }).catch(() => {
        setHourlyUser(null);
        onFailure();
      });
  }

  function signOut() {
    setHourlyUser(null);
  }

  const auth: AuthContextSchema = useMemo(() => ({
    user: hourlyUser,
    logInWithGoogle,
    signOut,
    isLoggedIn: (hourlyUser !== null),
  }), [hourlyUser]);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

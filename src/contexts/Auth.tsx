import {
  getAuth, GoogleAuthProvider, signInWithPopup, inMemoryPersistence,
} from 'firebase/auth';
import moment from 'moment';
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
  startOfDay: Date;
  endOfDay: Date;
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
    auth.setPersistence(inMemoryPersistence).then(() => {
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
          console.log(user);
          // start of day, end of day
          const startOfDay = moment('8:00 AM', 'h:mm A').toDate();
          const endOfDay = moment('10:00 PM', 'h:mm A').toDate();
          const authResponse: { id: string; startOfDay: string; endOfDay: string} = await FlaskClient.post('google_auth', {
            token,
            name: auth.name,
            startOfDay,
            endOfDay,
          });
          if (authResponse) {
            setHourlyUser({
              email: user.email || '',
              name: user.displayName || user.email || '',
              id: authResponse.id,
              refreshToken: user.refreshToken,
              accessToken: token,
              startOfDay: new Date(authResponse.startOfDay),
              endOfDay: new Date(authResponse.endOfDay),
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

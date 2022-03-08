import React, { createContext, useContext, useState } from 'react';
import * as Realm from 'realm-web';
import { authRedirectUri, realmAppId } from '../connections/Config';

export const AuthContext = createContext([{}, () => { /** Satisfy lint */ }] as [any, any]);

const app = Realm.App.getApp(realmAppId);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(app.currentUser);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const [state, setState] = useContext(AuthContext);

  function loginWithGoogle(token: string) {
    // Login user with Realm backend
    const credentials = Realm.Credentials.google(authRedirectUri);
    app.logIn(credentials).then((user) => {
      console.log('SIGNED IN');
      console.log(user);
      setState(user);
    });
  }

  function signOut() {
    // Log out the current user
    if (!app.currentUser) {
      return;
    }
    app.currentUser.logOut().then(() => {
      setState(null);
    });
  }

  return {
    loginWithGoogle,
    signOut,
    user: state,
  };
};

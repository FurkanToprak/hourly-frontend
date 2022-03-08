import React, { useContext, useState } from 'react'
import * as Realm from 'realm-web'

export const AuthContext = React.createContext([{}, () => {}])

const app = Realm.App.getApp(REALM_APP_ID)

export const AuthProvider = ({ children }: any) => {
    var [user, setUser] = useState(app.currentUser)

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {children}
        </AuthContext.Provider>
    )
}

export default const useAuth = () => {
  const [state, setState] = useContext(AuthContext);

  function loginWithGoogle(token) {
    // Login user with Realm backend
    const credentials = Realm.Credentials.google(token);
    app.logIn(credentials).then((user) => {
      setState(user);
    });
  }

  function signOut() {
    // Log out the current user
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

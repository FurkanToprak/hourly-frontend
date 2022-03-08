import React, { useState } from 'react';
import * as Realm from 'realm-web';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import useAuth from '../../contexts/Auth';
import { googleClientId } from '../../connections/Secrets';
import { Title } from '../utils/Texts';

const app = new Realm.App({ id: googleClientId });

const gAuthStyles: React.CSSProperties = {
  margin: 20,
  display: 'flex',
};

export default function GoogleOAuth(props: {
  type: 'Log In' | 'Sign Up'
}) {
  const [message, setMessage] = useState('');
  const { loginWithGoogle } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const successGoogle = (response: GoogleLoginResponse) => {
    if (response?.tokenId) {
      setMessage('');
      loginWithGoogle(response.tokenId);
    } else {
      setMessage('Cannot log in offline. Connect to a network and try again.');
    }
  };
  const failureGoogle = () => {
    setMessage('Error while logging in. Try again.');
  };
  return (
    <div style={gAuthStyles}>
      <GoogleLogin
        clientId={googleClientId}
        buttonText={props.type}
        onSuccess={(response) => successGoogle(response as GoogleLoginResponse)}
        onFailure={failureGoogle}
        cookiePolicy="single_host_origin"
        style={{ flex: 1 }}
        scope="profile email"
      />
      <Title size="s">{message}</Title>
    </div>
  );
}

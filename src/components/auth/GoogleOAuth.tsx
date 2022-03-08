import React, { useState } from 'react';
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login';
import { useAuth } from '../../contexts/Auth';
import { googleClientId } from '../../connections/Config';
import { Title } from '../utils/Texts';

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
        responseType="token"
        scope="profile email"
      />
      <Title size="s">{message}</Title>
    </div>
  );
}

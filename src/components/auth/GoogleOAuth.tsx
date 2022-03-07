import React from 'react';
import GoogleLogin from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
if (clientId === '') {
  throw Error('Google Client ID missing!');
}

export default function GoogleOAuth(props: {
    type: 'login' | 'signup'
}) {
  return (
    <GoogleLogin
      clientId={clientId}
      buttonText={props.type ? 'Log In' : 'Sign Up'}
      onSuccess={() => {
        // authenticate
      }}
      onFailure={() => {
        // popup message
      }}
      cookiePolicy="single_host_origin"
    />
  );
}

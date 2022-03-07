import React from 'react';
import GoogleLogin from 'react-google-login';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
if (clientId === '') {
  console.log(Error('Google Client ID missing!'));
}

const gAuthStyles: React.CSSProperties = {
  margin: 20,
};

export default function GoogleOAuth(props: {
    type: 'login' | 'signup'
}) {
  return (
    <div style={gAuthStyles}>
      <GoogleLogin
        clientId={clientId}
        buttonText={props.type === 'login' ? 'Log In' : 'Sign Up'}
        onSuccess={() => {
        // authenticate
        }}
        onFailure={() => {
        // popup message
        }}
        cookiePolicy="single_host_origin"
      />
    </div>
  );
}

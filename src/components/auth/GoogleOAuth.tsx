import React from 'react';
import { useAuth } from '../../contexts/Auth';
import { StandardButton } from '../utils/Buttons';

const gAuthStyles: React.CSSProperties = {
  margin: 20,
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
};

export default function GoogleOAuth(props: {
  type: 'Log In' | 'Sign Up'
}) {
  const { loginWithGoogle } = useAuth();
  return (
    <div style={gAuthStyles}>
      <StandardButton
        onMouseDown={() => {
          loginWithGoogle();
        }}
        variant="outlined"
        style={{ width: '30%' }}
      >
        {props.type}
      </StandardButton>
    </div>
  );
}

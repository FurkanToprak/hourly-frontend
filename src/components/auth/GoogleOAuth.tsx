import React, { useState } from 'react';
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
  const [buttonText, setButtonText] = useState(props.type as string);
  const onFailure = () => {
    setButtonText('Error. Try again.');
  };
  const { loginWithGoogle } = useAuth();
  return (
    <div style={gAuthStyles}>
      <StandardButton
        onMouseDown={() => {
          loginWithGoogle(onFailure);
        }}
        variant="outlined"
        style={{ width: '30%' }}
      >
        {buttonText}
      </StandardButton>
    </div>
  );
}

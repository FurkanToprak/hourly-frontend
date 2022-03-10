import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [buttonText, setButtonText] = useState(props.type as string);
  const onSuccess = () => {
    navigate('/dashboard');
  };
  const onFailure = () => {
    setButtonText('Error. Try again.');
  };
  const { logInWithGoogle } = useAuth();
  return (
    <div style={gAuthStyles}>
      <StandardButton
        onMouseDown={() => {
          logInWithGoogle(onSuccess, onFailure);
        }}
        variant="outlined"
        style={{ width: '30%' }}
      >
        {buttonText}
      </StandardButton>
    </div>
  );
}

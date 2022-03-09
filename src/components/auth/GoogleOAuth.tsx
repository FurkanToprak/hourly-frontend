import React, { useState } from 'react';
import { useAuth } from '../../contexts/Auth';
import { Title } from '../utils/Texts';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loginWithGoogle } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
      <Title size="s">{message}</Title>
    </div>
  );
}

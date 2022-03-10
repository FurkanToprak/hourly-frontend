import React from 'react';
import { Title } from '../components/utils/Texts';

const notFoundStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const imageStyle: React.CSSProperties = {
  width: '50%',
};

const linkStyle: React.CSSProperties = { textDecoration: 'none' };

export default function NotFound() {
  return (
    <div style={notFoundStyle}>
      <img alt="Not found." style={imageStyle} src={require('../components/utils/logo512.png')} />
      <Title size="xl" color="purple">404</Title>
      <Title size="xl" color="raspberry">Not Found</Title>
      <a href="/" style={linkStyle}><Title size="m" color="purple" decoration="underline">go to home page</Title></a>
    </div>
  );
}

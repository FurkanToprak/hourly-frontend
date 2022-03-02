import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders welcome on homepage', () => {
  render(<App />);
  const welcome = screen.getByText('Welcome!');
  expect(welcome).toBeInTheDocument();
});

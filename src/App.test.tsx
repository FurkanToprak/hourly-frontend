import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders Hourly on homepage', () => {
  render(<App />);
  const welcome = screen.getByText('Hourly');
  expect(welcome).toBeInTheDocument();
});

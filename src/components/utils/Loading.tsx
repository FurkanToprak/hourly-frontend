import React from 'react';
import { CircularProgress } from '@mui/material';
import { purple } from '../../styles/Theme';

export default function Loading() {
  return <CircularProgress style={{ color: purple }} />;
}

import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, lightBackground, purple, raspberry,
} from '../../styles/Theme';

export const PurpleButton = styled(Button)(() => ({
  color: purple,
  borderColor: purple,
  borderWidth: 2,
  '&:hover': {
    backgroundColor: purple,
    color: '#FFF',
    borderWidth: 2,
  },
  '&:disabled': {
    backgroundColor: purple,
    color: '#FFF',
    opacity: 0.7,
    borderColor: purple,
    borderWidth: 2,
  },
}));

export const RaspberryButton = styled(Button)(() => ({
  color: raspberry,
  borderColor: raspberry,
  borderWidth: 2,
  '&:hover': {
    backgroundColor: raspberry,
    color: '#FFF',
    borderWidth: 2,
    borderColor: raspberry,
  },
  '&:disabled': {
    backgroundColor: raspberry,
    color: '#FFF',
    opacity: 0.7,
    borderColor: raspberry,
    borderWidth: 2,
  },
}));

export const StandardButton = styled(Button)(() => {
  const { theme } = useTheme();
  const colorOne = theme === 'light' ? darkBackground : lightBackground;
  const colorTwo = theme === 'light' ? lightBackground : darkBackground;
  return ({
    color: colorOne,
    borderWidth: 2,
    borderColor: colorOne,
    '&:hover': {
      backgroundColor: colorOne,
      color: colorTwo,
      borderColor: colorOne,
      borderWidth: 2,
    },
    '&:disabled': {
      color: colorOne,
      opacity: 0.7,
      borderColor: colorOne,
      borderWidth: 2,
    },
  });
});

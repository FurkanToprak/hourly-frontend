import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTheme } from '../../contexts/Theme';
import { darkBackground, lightBackground, purple, raspberry } from '../../styles/Theme';

export const PurpleButton = styled(Button)((_theme) => ({
  color: purple,
  borderColor: purple,
  borderWidth: 2,
  '&:hover': {
    backgroundColor: purple,
    color: '#FFF',
    borderWidth: 2
  },
}));
  
export const RaspberryButton = styled(Button)((_theme) => ({
  color: raspberry,
  borderColor: raspberry,
  borderWidth: 2,
  '&:hover': {
    backgroundColor: raspberry,
    color: '#FFF',
    borderWidth: 2,
    borderColor: raspberry,
  },
}));
    
export const StandardButton = styled(Button)((_theme) => {
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
  });});

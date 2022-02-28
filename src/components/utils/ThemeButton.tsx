import React from 'react';
import { useTheme } from '../../contexts/Theme';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { StandardButton } from './Buttons';
export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <StandardButton onMouseDown={() => {toggleTheme();}} style={themeButtonStyle}>
      {theme === 'light' ? <DarkModeIcon/> : <LightModeIcon/>}
    </StandardButton>
  );
}

const themeButtonStyle = { width: '100%'};
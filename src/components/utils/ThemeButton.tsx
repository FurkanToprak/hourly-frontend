import React from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../../contexts/Theme';
import { StandardButton } from './Buttons';

const themeButtonStyle = { width: '100%' };

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <StandardButton onMouseDown={() => { toggleTheme(); }} style={themeButtonStyle}>
      {theme === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
    </StandardButton>
  );
}

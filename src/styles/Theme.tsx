import React from 'react';
import { useTheme } from '../contexts/Theme';

export const lightBackground = '#FFF';
export const darkBackground = '#080517';
export const raspberry = '#DB2955';
export const purple = '#4B2FDA';
export const grey = '#7A7A7A';
export const black = '#000';
export const white = '#fff';
export const darkBorder = '2px solid white';
export const lightBorder = '2px solid black';

const themeBackgroundStyle: React.CSSProperties = {
  transition: 'all 0.6s cubic-bezier(.28,.02,.02,1.1)',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

export function ThemeBackground(props: {
    children: any
}) {
  const { theme } = useTheme();
  return (
    <div style={{
      backgroundColor: (theme === 'light' ? lightBackground : darkBackground),
      ...themeBackgroundStyle,
    }}
    >
      {props.children}
    </div>
  );
}

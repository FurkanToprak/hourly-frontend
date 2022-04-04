import React from 'react';
import { useTheme } from '../contexts/Theme';

export const lightBackground = '#FFF';
export const darkBackground = '#282e38';
export const lightRaspberry = '#e35e7f';
export const raspberry = '#DB2955';
export const darkRaspberry = '#DB2955';
export const lightPurple = '#8672eb';
export const purple = '#4B2FDA';
export const darkPurple = '#492be1';
export const grey = '#7A7A7A';
export const black = 'black';
export const white = 'white';
export const darkBorder = '2px solid white';
export const lightBorder = '2px solid black';
export const thinDarkBorder = '1px solid white';
export const thinLightBorder = '1px solid black';

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

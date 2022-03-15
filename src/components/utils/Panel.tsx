import React from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, darkBorder, lightBackground, lightBorder,
} from '../../styles/Theme';

const panelStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
};

const panelContentStyle: React.CSSProperties = {
  flex: 1,
  margin: 10,
  borderRadius: 10,
  minHeight: 40,
  display: 'flex',
  flexDirection: 'column',
};

export default function Panel(props: {
    solid?: true;
    centerX?: true;
    centerY?: true;
    fill?: true;
    margin?: true;
    flex?: 'row' | 'column';
    children: JSX.Element | JSX.Element[];
}) {
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  const themeBackground = theme === 'light' ? lightBackground : darkBackground;
  const backgroundColor = props.solid ? themeBackground : undefined;
  return (
    <div style={{ flex: props.fill ? 1 : undefined, backgroundColor, ...panelStyle }}>
      <div style={{
        ...panelContentStyle,
        border: themeBorder,
        alignItems: props.centerY ? 'center' : undefined,
        justifyContent: props.centerX ? 'center' : undefined,
        display: 'flex',
        flexDirection: props.flex,
        padding: props.margin ? 10 : undefined,
      }}
      >
        {props.children}
      </div>
    </div>
  );
}

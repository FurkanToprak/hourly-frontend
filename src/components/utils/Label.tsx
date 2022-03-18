import React from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, lightBackground,
} from '../../styles/Theme';
import { Title } from './Texts';

export default function Label(props: {
    children: any
}) {
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? 'white' : 'black';
  const themeBackground = theme === 'light' ? darkBackground : lightBackground;
  return (
    <span style={{ backgroundColor: themeBackground, borderRadius: 4, padding: 2 }}>
      <Title color={themeColor} size="xs">{props.children}</Title>
    </span>
  );
}

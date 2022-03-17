import React from 'react';
import { useTheme } from '../../contexts/Theme';
import { thinDarkBorder, thinLightBorder } from '../../styles/Theme';
import { Body } from './Texts';

export default function Label(props: {
    children: any
}) {
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  return (
    <span style={{ border: themeBorder, borderRadius: 4, padding: 2 }}>
      <Body>{props.children}</Body>
    </span>
  );
}

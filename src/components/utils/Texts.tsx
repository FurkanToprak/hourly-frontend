import React from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  raspberry, purple, black, grey, white,
} from '../../styles/Theme';

export type FontSize = 'xl' | 'l' | 'm' | 's' | 'xs';
export type FontColor = 'raspberry' | 'purple' | 'black' | 'grey' | 'white';
export type FontDecoration = 'bold' | 'underline' | 'italic';

const fontSizeMap = new Map(
  Object.entries({
    xl: '3.5em',
    l: '2em',
    m: '1.6em',
    s: '1.3em',
    xs: '1em',
  }),
);

const fontColorMap = new Map(
  Object.entries({
    white,
    black,
    grey,
    raspberry,
    purple,
  }),
);

const TitleStyles = {
  fontFamily: 'Rubik',
  fontWeight: 500,
};

const BodyStyles = {
  fontFamily: 'Rubik',
  fontWeight: 300,
};

export function Title(props: {
  size?: FontSize;
  decoration?: FontDecoration;
  color?: FontColor;
  children: string;
}) {
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? black : white;
  return (
    <span style={
    {
      ...TitleStyles,
      fontSize: props.size ? fontSizeMap.get(props.size) : '3em',
      color: props.color ? fontColorMap.get(props.color) : themeColor,
      textDecoration: props.decoration,
    }
  }
    >
      {props.children}
    </span>
  );
}

export function Body(props: {
  size?: FontSize;
  decoration?: FontDecoration;
  color?: FontColor;
  children: string;
}) {
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? black : white;
  return (
    <span style={
    {
      ...BodyStyles,
      fontSize: props.size ? fontSizeMap.get(props.size) : '1em',
      color: props.color ? fontColorMap.get(props.color) : themeColor,
      textDecoration: props.decoration,
    }
  }
    >
      {props.children}
    </span>
  );
}

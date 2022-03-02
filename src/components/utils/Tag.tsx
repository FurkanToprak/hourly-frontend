/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import { Body } from './Texts';
import { useTheme } from '../../contexts/Theme';
import {
  black, darkBorder, lightBorder, white,
} from '../../styles/Theme';

const cancelStyle = { cursor: 'pointer' };
const tagStyle = { borderRadius: 10, padding: 5, marginBottom: 4 };

export function Tag(props: { type: 'industry' | 'affiliation' | 'interest'; label: string; onDelete?: () => void }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const iconThemeColor = theme === 'light' ? black : white;
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  return (
    <div
      style={{ ...tagStyle, border: themeBorder, cursor: props.onDelete ? undefined : 'pointer' }}
      onMouseDown={
    () => {
      if (props.onDelete) {
        return;
      }
      navigate(`/search?${props.type}=${props.label}`);
    }
  }
    >

      {props.onDelete && (
      <CancelIcon
        htmlColor={iconThemeColor}
        style={cancelStyle}
        onMouseDown={() => {
          if (props.onDelete) {
            props.onDelete();
          }
        }}
      />
      )}
      <Body>{props.label}</Body>
    </div>
  );
}

export function TagContainer(props: { children: React.ReactNode}) {
  return <div style={{ width: '100%' }}>{props.children}</div>;
}

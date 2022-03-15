import React from 'react';
import { Modal as MuiModal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Panel from './Panel';
import { black, white } from '../../styles/Theme';
import { useTheme } from '../../contexts/Theme';

export default function Modal(props: {
    children: any | any[];
    open: boolean;
    onClose: () => void;
}) {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  return (
    <MuiModal open={props.open} onClose={props.onClose}>
      <div>
        <Panel flex="column" centerY margin solid>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
            <CloseIcon
              fontSize="large"
              style={{ cursor: 'pointer', color: themeFont }}
              onMouseDown={() => {
                props.onClose();
              }}
            />
          </div>
          {props.children}
        </Panel>
      </div>
    </MuiModal>
  );
}

import React from 'react';
import { Checkbox as MuiCheckbox, CheckboxProps, FormControl } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Body } from './Texts';
import { purple } from '../../styles/Theme';

export default function Checkbox(props:
    { label: string;
      checkColor?: string;
        isChecked: boolean;
        onCheck: (newChecked: boolean) => void } & CheckboxProps) {
  return (
    <FormControl>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          value="start"
          control={(
            <MuiCheckbox
              style={{
                color: props.checkColor || purple,
              }}
              checked={props.isChecked}
              onChange={(e) => {
                const { checked } = e.target;
                props.onCheck(checked);
              }}
            />
)}
          label={<Body>{props.label}</Body>}
          labelPlacement="start"
        />
      </FormGroup>
    </FormControl>
  );
}

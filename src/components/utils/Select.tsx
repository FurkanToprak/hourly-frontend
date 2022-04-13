import React, { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { InputBase, Select } from '@mui/material';
import styled from '@emotion/styled';
import { Body } from './Texts';
import { useTheme } from '../../contexts/Theme';
import {
  black,
  darkBackground, thinDarkBorder, lightBackground, thinLightBorder, white,
} from '../../styles/Theme';

const StandardSelectBase = styled(InputBase)(() => {
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  return {
    'label + &': {
      marginTop: 5,
      color: theme === 'light' ? black : white,
    },
    '& .MuiInputBase-input': {
      color: theme === 'light' ? black : white,
      borderRadius: 4,
      position: 'relative',
      border: themeBorder,
      paddingLeft: 10,
      fontSize: 16,
      '&:focus': {
        borderRadius: 4,
        borderColor: themeBorder,
        color: theme === 'light' ? black : white,
        paddingLeft: 10,
      },
    },
  };
});

export default function StandardSelect(props: {
  defaultValue?: string;
  values: Map<string, any>;
  label: string;
  onSelect: (select: string) => void
}) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(props.defaultValue || '');
  const handleChange = (event: any) => {
    props.onSelect(event.target.value);
    setSelected(event.target.value);
  };
  return (
    <div style={{ marginTop: 10 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">
          <Body>{props.label}</Body>
        </InputLabel>
        <Select
          defaultValue={props.defaultValue}
          value={selected}
          onChange={handleChange}
          input={<StandardSelectBase />}
        >
          { Array.from(props.values, ([key, value]) => (
            <MenuItem
              value={value}
              key={`select-option-${key}`}
              style={{
                backgroundColor: theme === 'light' ? lightBackground : darkBackground,
              }}
            >
              <Body>{key}</Body>
            </MenuItem>
          )) }
        </Select>
      </FormControl>
    </div>
  );
}

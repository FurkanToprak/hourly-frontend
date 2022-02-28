import styled from '@emotion/styled';
import { InputBase, TextField, TextFieldProps } from '@mui/material';
import { useTheme } from '../../contexts/Theme';
import { black, darkBackground, darkBorder, lightBackground, lightBorder, purple, raspberry, white } from '../../styles/Theme';
import React, { useState } from 'react';

export const PurpleInput = styled(TextField)({
  color: purple,
  input: {
    color: purple
  },
  label: {
    color: purple
  },
  '& label.Mui-focused': {
    color: purple,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: purple,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: purple,
    },
    '&:hover fieldset': {
      borderColor: purple,
    },
    '&.Mui-focused fieldset': {
      borderColor: purple,
    },
  },
});

export const RaspberryInput = styled(TextField)({
  color: raspberry,
  input: {
    color: raspberry
  },
  label: {
    color: raspberry
  },
  '& label.Mui-focused': {
    color: raspberry,
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: raspberry,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: raspberry,
    },
    '&:hover fieldset': {
      borderColor: raspberry,
    },
    '&.Mui-focused fieldset': {
      borderColor: raspberry,
    },
  },
});

export const StandardInput = styled(TextField)(() => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? darkBackground : lightBackground;
  return {
    color: textColor,
    input: {
      color: textColor
    },
    label: {
      color: textColor
    },
    '& label.Mui-focused': {
      color: textColor,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: textColor,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: textColor,
      },
      '&:hover fieldset': {
        borderColor: textColor,
      },
      '&.Mui-focused fieldset': {
        borderColor: textColor,
      },
    },
    '& .MuiInputBase-inputMultiline': {
      color: textColor
    }
  };});

export function StandardNumericalInput(props: TextFieldProps & {
  onNumberChange: (newNumber: number) => void
}) {
  const { onNumberChange, ...inputProps} = props;
  const [val, setVal] = useState('');
  return <StandardInput value={val} {...inputProps} onChange={(e) => {
    const freshInput = e.target.value;
    let processedOutput = freshInput;
    if (freshInput.length > 0) {
      const lastChar = freshInput.slice(-1);
      const isExtraDecimal = lastChar === '.' && processedOutput.slice(0, -1).includes('.');
      const isNotNumberOrDecimal = lastChar !== '.' && (lastChar < '0' || '9' < lastChar);
      if (isExtraDecimal || isNotNumberOrDecimal) {
        processedOutput = freshInput.slice(0, -1);
      }
    }
    setVal(processedOutput);
    onNumberChange(processedOutput === '' ? NaN : Number(processedOutput));
  }}/>;
}

export const StandardSelect = styled(InputBase)((_theme) => {
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  return {
    'label + &': {
      marginTop: 5,
      color: theme === 'light' ? black : white
    },
    '& .MuiInputBase-input': {
      flex: 1,
      height: '100%',
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
        paddingLeft: 10
      },
    },
  };
}
);

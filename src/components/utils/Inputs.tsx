import styled from '@emotion/styled';
import { TextField, TextFieldProps } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, lightBackground, purple, raspberry,
} from '../../styles/Theme';

export const PurpleInput = styled(TextField)({
  color: purple,
  input: {
    color: purple,
  },
  label: {
    color: purple,
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
    color: raspberry,
  },
  label: {
    color: raspberry,
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
      color: textColor,
    },
    label: {
      color: textColor,
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
      color: textColor,
    },
  };
});

export function StandardNumericalInput(props: TextFieldProps & {
  onNumberChange: (newNumber: number) => void
}) {
  const { onNumberChange, ...inputProps } = props;
  const [val, setVal] = useState('');
  return (
    <StandardInput
      value={val}
      {...inputProps}
      onChange={(e) => {
        const freshInput = e.target.value;
        let processedOutput = freshInput;
        if (freshInput.length > 0) {
          const lastChar = freshInput.slice(-1);
          const isExtraDecimal = lastChar === '.' && processedOutput.slice(0, -1).includes('.');
          const isNotNumberOrDecimal = lastChar !== '.' && (lastChar < '0' || lastChar > '9');
          if (isExtraDecimal || isNotNumberOrDecimal) {
            processedOutput = freshInput.slice(0, -1);
          }
        }
        setVal(processedOutput);
        onNumberChange(processedOutput === '' ? NaN : Number(processedOutput));
      }}
    />
  );
}

export function StandardTimeInput(props: TextFieldProps & {
  onTimeChange: (newNumber: string) => void
}) {
  const { onTimeChange, ...inputProps } = props;
  const [val, setVal] = useState('');
  return (
    <StandardInput
      value={val}
      {...inputProps}
      onChange={(e) => {
        const timeInput = e.target.value;
        if (timeInput.length > 0) {
          const lastChar = timeInput.slice(-1);
          const lastIsColon = lastChar === ':';
          const firstColonPosition = timeInput.indexOf(':');
          if (timeInput.length - firstColonPosition > 3) {
            return; // ##:##
          }
          const isExtraColon = lastIsColon && (timeInput.length - 1 > firstColonPosition);
          if (isExtraColon) {
            return;
          }
          const isNotNumberOrColon = !lastIsColon && (lastChar < '0' || lastChar > '9');
          if (isNotNumberOrColon) {
            return;
          }
          if (!lastIsColon && firstColonPosition >= 0) {
            const splitTime = timeInput.split(':');
            const validMins = Number(splitTime[1]);
            if (validMins > 59) {
              return;
            }
          }
        }
        setVal(timeInput);
        onTimeChange(timeInput);
      }}
    />
  );
}

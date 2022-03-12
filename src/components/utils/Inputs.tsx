import styled from '@emotion/styled';
import { TextField, TextFieldProps } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  darkBackground, lightBackground, purple, raspberry,
} from '../../styles/Theme';
import { daysPerMonth } from '../../utils/Time';

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
      label={`${props.label}`}
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

export function StandardDateInput(props: TextFieldProps & {
  onDateChange: (newDate: string) => void
}) {
  const { onDateChange, ...inputProps } = props;
  const [val, setVal] = useState('');
  return (
    <StandardInput
      value={val}
      {...inputProps}
      onChange={(e) => {
        const dateInput = e.target.value;
        if (dateInput.length) {
          const lastChar = dateInput.slice(-1);
          const lastIsSlash = lastChar === '/';
          if (!lastIsSlash) {
            const lastIsNumeric = lastChar < '0' || lastChar > '9';
            if (lastIsNumeric) {
              return;
            }
          }
          const splitInput = dateInput.split('/');
          if (lastIsSlash && splitInput.length === 4) {
            return; // too many slashes
          }
          // content regulation
          const firstBlock = splitInput[0];
          if (firstBlock.length > 2) {
            return;
          }
          if (Number(firstBlock) > 12) {
            setVal('12');
            return;
          }
          if (splitInput.length > 1) {
            const secondBlock = splitInput[1];
            if (secondBlock.length > 2) {
              return;
            }
            const maxPossibleDays = daysPerMonth.get(Number(firstBlock)) || 0;
            if (Number(secondBlock) > maxPossibleDays) {
              setVal(`${firstBlock}/${maxPossibleDays}`);
              return;
            }
          }
          if (splitInput.length > 2) {
            const thirdBlock = splitInput[2];
            if (thirdBlock.length > 4) {

            }
          }
        } else {
          setVal(dateInput);
          onDateChange(dateInput);
        }
      }}
    />
  );
}

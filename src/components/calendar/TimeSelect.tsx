import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import '../../styles/TimeSelect.css';
import { StandardInput } from '../utils/Inputs';

export default function TimeSelect(props: {
    label: string;
    default: Date;
    onDateChange?: (newDate: Date) => void;
    onTimeChange?: (newTime: Date) => void;
    showTimeSelectOnly?: true;
  }) {
  const [selectedDate, setSelectedDate] = useState(props.default);
  const displayValue = props.showTimeSelectOnly ? `${selectedDate.getHours()}:${selectedDate.getMinutes() || '00'}` : selectedDate.toString();
  return (
    <DatePicker
      openToDate={props.default}
      showTimeSelect
      showTimeSelectOnly={props.showTimeSelectOnly}
      selected={selectedDate}
      value={displayValue}
      onChange={(date: Date) => {
        setSelectedDate(date);
        if (props.showTimeSelectOnly && props.onTimeChange) {
          props.onTimeChange(date);
        } else if (props.onDateChange) {
          props.onDateChange(date);
        }
      }}
      customInput={<StandardInput label={props.label} fullWidth />}
    />
  );
}

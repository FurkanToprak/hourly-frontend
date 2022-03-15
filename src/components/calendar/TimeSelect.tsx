import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import '../../styles/TimeSelect.css';
import { StandardInput } from '../utils/Inputs';

export default function TimeSelect(props: {
    label: string;
    onDateChange: (newDate: Date) => void
  }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <DatePicker
      showTimeSelect
      selected={selectedDate}
      value={selectedDate.toString()}
      onChange={(date: Date) => {
        setSelectedDate(date);
        props.onDateChange(date);
      }}
      customInput={<StandardInput label={props.label} fullWidth />}
    />
  );
}

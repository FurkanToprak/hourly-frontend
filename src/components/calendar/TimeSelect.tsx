import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTheme } from '../../contexts/Theme';
import { thinDarkBorder, thinLightBorder } from '../../styles/Theme';
import { Body } from '../utils/Texts';
import '../../styles/TimeSelect.css';

export default function TimeSelect(props: {
    label: string;
    onDateChange: (newDate: Date) => void
  }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  return (
    <div style={{
      flex: 1, borderRadius: 5, zIndex: 9999, border: themeBorder, display: 'flex', flexDirection: 'column', alignItems: 'center',
    }}
    >
      <Body>{props.label}</Body>
      <DatePicker
        showTimeSelect
        selected={selectedDate}
        value={selectedDate.toString()}
        onChange={(date: Date) => {
          setSelectedDate(date);
          props.onDateChange(date);
        }}
      />
    </div>
  );
}

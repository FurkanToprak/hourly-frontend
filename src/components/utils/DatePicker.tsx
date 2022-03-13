import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DatePicker from 'react-datepicker';
import { useTheme } from '../../contexts/Theme';
import { thinDarkBorder, thinLightBorder } from '../../styles/Theme';
import { Title } from './Texts';
import 'react-datepicker/dist/react-datepicker.css';

export default function StandardDateInput(props: {
    label: string;
    onDateChange: (newDate: Date) => void
  }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  return (
    <div style={{ borderRadius: 2, border: themeBorder }}>
      <Title size="m">{props.label}</Title>
      <DatePicker
        showTimeSelect
        selected={selectedDate}
        onChange={(date: Date) => {
          setSelectedDate(date);
          props.onDateChange(date);
        }}
      />
    </div>
  );
}

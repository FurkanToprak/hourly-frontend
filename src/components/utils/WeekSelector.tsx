/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from 'react';
import { useTheme } from '../../contexts/Theme';
import {
  black, raspberry, white,
} from '../../styles/Theme';
import { Body } from './Texts';

export default function WeekSelector(props: { onChange: (newDaysOfWeek: string) => void}) {
  const [selected, setSelected] = useState(new Set<string>());
  const daysOfWeek = {
    U: 'S',
    M: 'M',
    T: 'T',
    W: 'W',
    R: 'T',
    F: 'F',
    S: 'S',
  };
  const { theme } = useTheme();
  const themeColor = theme === 'light' ? white : black;
  const circleColor = theme === 'light' ? black : white;
  return (
    <div style={{ display: 'flex' }}>
      {
          Object.entries(daysOfWeek)
            .map(([dayValue, dayDisplay]) => {
              const daySelected = selected.has(dayValue);
              return (
                <div
                  key={`day-button-${dayValue}`}
                  role="button"
                  style={{
                    backgroundColor: daySelected ? raspberry : circleColor,
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    cursor: 'pointer',
                  }}
                  onMouseDown={() => {
                    const freshSelected = new Set(selected);
                    if (daySelected) {
                      freshSelected.delete(dayValue);
                    } else {
                      freshSelected.add(dayValue);
                    }
                    setSelected(freshSelected);
                    let daysString = '';
                    Object.keys(freshSelected).forEach(((selectedDay) => {
                      daysString += selectedDay;
                    }));
                    props.onChange(daysString);
                  }}
                >
                  <Body color={themeColor}>{dayDisplay}</Body>
                </div>
              );
            })
      }
    </div>
  );
}

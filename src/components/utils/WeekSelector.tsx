/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { useState } from 'react';
import { purple, raspberry, white } from '../../styles/Theme';
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
  return (
    <div style={{ display: 'flex' }}>
      {
          Object.entries(daysOfWeek)
            .map(([dayValue, dayDisplay]) => {
              const daySelected = selected.has(dayValue);
              return (
                <div
                  role="button"
                  style={{
                    backgroundColor: daySelected ? raspberry : purple,
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
                  <Body color={white}>{dayDisplay}</Body>
                </div>
              );
            })
      }
    </div>
  );
}

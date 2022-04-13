import React, { useState } from 'react';
import { useTheme } from '../../contexts/Theme';
import { ExpiredTaskSchema } from '../../pages/Dashboard';
import { darkBorder, lightBorder } from '../../styles/Theme';
import Checkbox from '../utils/Checkbox';
import StandardSelect from '../utils/Select';
import { Body } from '../utils/Texts';

export default function TasksLeft(props: {
    expiredTasks: ExpiredTaskSchema[]
}) {
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  return (
    <div style={{ marginTop: 10, borderTop: themeBorder, width: '100%' }}>
      {
      props.expiredTasks.map((expiredTask: ExpiredTaskSchema) => {
        const hoursLeft = Math.floor(expiredTask.hours);
        const minutesLeft = (expiredTask.hours - hoursLeft) * 60;
        const hoursOptions = new Map(
          Array.from({
            length: hoursLeft + 1,
          }, (_hourOption, index: number) => [index.toString(), index]),
        );
        const [selectedHoursWorked, setSelectedHoursWorked] = useState(
          hoursLeft.toString(),
        );
        const [selectedMinutesWorked, setSelectedMinutesWorked] = useState(
          (minutesLeft === 0) ? '0' : '30',
        );
        const minuteOptions = new Map<string, number>([
          ['0', 0],
        ]);
        if (minutesLeft !== 0 || selectedHoursWorked !== hoursLeft.toString()) {
          minuteOptions.set('30', 30);
        }
        return (
          <div
            id={`left-select-${expiredTask.id}`}
            style={{
              marginTop: 10, marginBottom: 10, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
            }}
          >
            <div style={{
              flex: 3, display: 'flex', alignItems: 'center',
            }}
            >
              <Body>{expiredTask.name}</Body>
            </div>
            <div style={{ flex: 1, marginRight: 10 }}>
              <StandardSelect
                defaultValue={selectedHoursWorked}
                values={hoursOptions}
                onSelect={(newHoursWorked) => {
                  setSelectedHoursWorked(newHoursWorked);
                }}
                label="Hours Worked"
              />
            </div>
            <div style={{ flex: 1 }}>
              <StandardSelect
                defaultValue={selectedMinutesWorked}
                values={minuteOptions}
                onSelect={(newMinutesWorked) => {
                  setSelectedMinutesWorked(newMinutesWorked);
                }}
                label="Minutes Worked"
              />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
            }}
            >
              <Checkbox
                isChecked={false}
                onCheck={() => {
                  // test
                }}
                label=""
              />
            </div>

          </div>
        );
      })
    }
    </div>
  );
}

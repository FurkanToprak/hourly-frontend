import React, { useState } from 'react';
import FlaskClient from '../../connections/Flask';
import { useTheme } from '../../contexts/Theme';
import { ExpiredSchema, ExpiredTaskSchema } from '../../pages/Dashboard';
import { darkBorder, lightBorder } from '../../styles/Theme';
import Checkbox from '../utils/Checkbox';
import StandardSelect from '../utils/Select';
import Table from '../utils/Table';
import { Body, Title } from '../utils/Texts';

const exampleExpired: ExpiredTaskSchema = {
  completed: 0,
  name: 'Expired Task',
  description: 'Oops',
  label: 'MISSED',
  estimated_time: 2,
  start_date: new Date(),
  due_date: new Date(),
  id: 'iasdada',
  user_id: 'asdfadasddas',
  do_not_schedule: true,
  hours: 1,
};
export default function TasksLeft(props: {
    expiredTasks: ExpiredSchema
}) {
  const { theme } = useTheme();
  const [updatedTasks, setUpdatedTasks] = useState(new Set<string>());
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  const updateTask = async (taskId: string, completedHours: number) => {
    await FlaskClient.post('tasks/updateTask', {
      task_id: taskId,
      hours: completedHours,
    });
    const freshUpdatedTasks = new Set(updatedTasks);
    freshUpdatedTasks.add(taskId);
    setUpdatedTasks(freshUpdatedTasks);
  };
  const pastDue: ExpiredTaskSchema[] = [exampleExpired,
    exampleExpired];// props.expiredTasks.past_due_tasks
  return (
    <div style={{ marginTop: 10, borderTop: themeBorder, width: '100%' }}>
      {
      props.expiredTasks.expired_tasks.map((expiredTask: ExpiredTaskSchema) => {
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
        const timeSelected = Number.parseInt(selectedHoursWorked, 10)
         + (Number.parseInt(selectedMinutesWorked, 10) / 60);
        if (updatedTasks.has(expiredTask.id)) {
          return undefined;
        }
        return (
          <div
            key={`left-select-${expiredTask.id}`}
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
                  updateTask(expiredTask.id, timeSelected);
                }}
                label=""
              />
            </div>
          </div>
        );
      })
    }
      {pastDue.length === 0 ? <div /> : (
        <div style={{
          width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
        >
          <Title size="m">Overdue Tasks</Title>
          <Table
            mini
            emptyMessage=""
            keys={[
              'name', 'description', 'label', 'due_date',
            ]}
            columns={['Name', 'Description', 'label', 'Due Date']}
            items={pastDue}
          />
          <div />
        </div>
      )}
    </div>
  );
}

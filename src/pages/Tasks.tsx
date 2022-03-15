import React, { useState } from 'react';
import { StandardInput, StandardTimeInput } from '../components/utils/Inputs';
import StandardSelect from '../components/utils/Select';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';
import { StandardButton } from '../components/utils/Buttons';
import DatePicker from '../components/calendar/TimeSelect';

const rowStyle = {
  margin: 10, width: '50%',
};

export default function Tasks() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const readyToSchedule = !Number.isNaN(estimatedTime)
    && name.length > 0 && description.length > 0 && label.length > 0;
  return (
    <Page centerY>
      <Title>Tasks</Title>
      <Panel centerY flex="column">
        <div style={rowStyle}>
          <StandardInput
            label="Name"
            fullWidth
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div style={rowStyle}>
          <StandardInput
            label="Description"
            fullWidth
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </div>
        <div style={rowStyle}>
          <StandardTimeInput
            fullWidth
            label="Estimated Time (HH:MM)"
            onTimeChange={(newTime) => {
              setEstimatedTime(newTime);
            }}
          />
        </div>
        <div style={rowStyle}>
          <StandardSelect
            label="Label"
            values={new Map<string, any>(Object.entries({
              'MATH 222': 'id1',
              'CSCE 132': 'id2',
              'CSCE 999': 'id3',
            }))}
            onSelect={(select: string) => {
              setLabel(select);
            }}
          />
        </div>
        <div style={rowStyle}>
          <DatePicker
            label="Deadline (MM/DD/YYYY)"
            onDateChange={(newDate) => {
              setDeadline(newDate);
            }}
          />
        </div>
        <div style={rowStyle}>
          <StandardButton
            disabled={!readyToSchedule}
            variant="outlined"
            fullWidth
            onMouseDown={() => {
              if (!readyToSchedule) {
                return;
              }
              const payload = {
                name,
                description,
                label,
                deadline,
                estimatedTime,
              };
              console.log('payload');
              console.log(payload);
            }}
          >
            Schedule
          </StandardButton>
        </div>
      </Panel>
    </Page>
  );
}

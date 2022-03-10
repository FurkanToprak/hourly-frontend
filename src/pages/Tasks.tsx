import React, { useState } from 'react';
import { StandardInput } from '../components/utils/Inputs';
import StandardSelect from '../components/utils/Select';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';
import { StandardButton } from '../components/utils/Buttons';

const rowStyle = {
  margin: 10, width: '50%',
};

export default function Tasks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [name, setName] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [description, setDescription] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [label, setLabel] = useState('');
  console.log(`label${label}`);
  const readyToSchedule = name.length > 0 && description.length > 0 && label.length > 0;
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
        { /** deadline, time estimated, group */}
        <div style={rowStyle}>
          { /** group */}
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
          <StandardButton
            disabled={!readyToSchedule}
            variant="outlined"
            fullWidth
            onMouseDown={() => {
              //
              if (!readyToSchedule) {
                return;
              }
              console.log('a');
            }}
          >
            Schedule
          </StandardButton>
        </div>
      </Panel>
    </Page>
  );
}

import React, { useState } from 'react';
import { StandardInput } from '../components/utils/Inputs';
import StandardSelect from '../components/utils/Select';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';

const rowStyle = {
  margin: 10, width: '50%',
};

export default function Tasks() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [label, setLabel] = useState('');
  return (
    <Page centerY>
      <Title>Tasks</Title>
      <Panel centerY flex="column">
        <div style={rowStyle}>
          <StandardInput label="Name" fullWidth />
        </div>
        <div style={rowStyle}>
          <StandardInput label="Description" fullWidth />
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
      </Panel>
    </Page>
  );
}

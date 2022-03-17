import React from 'react';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import Label from '../components/utils/Label';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import { purple, raspberry, white } from '../styles/Theme';
import { toShortTimeString } from '../utils/Time';
import { TaskItem } from './Tasks';

const labelRowStyle: React.CSSProperties = {
  marginTop: 10, marginBottom: 10,
};

const statRowStyle: React.CSSProperties = { flex: 1, display: 'flex' };

export default function Task() {
  const fetchedTask: TaskItem = {
    name: 'Remove hard-coded values',
    description: 'Attach database to frontend',
    label: 'Frontend',
    estimatedTime: '02:22',
    deadline: new Date(),
    scheduled: [new Date()],
    id: 'string',
  };

  return (
    <Page fullHeight>
      <Panel flex="column" margin>
        <Title>Task</Title>
        <div>
          <Title size="xs">{'Task: '}</Title>
          <Body>{fetchedTask.name}</Body>
        </div>
        <div style={labelRowStyle}>
          <Title size="xs">{'Label: '}</Title>
          <Label>{fetchedTask.label}</Label>
        </div>
        <div>
          <Title size="xs">{'Description: '}</Title>
          <Body>{fetchedTask.description}</Body>
        </div>
        <div>
          <Title size="xs">{'Estimated Time: '}</Title>
          <Body>{fetchedTask.estimatedTime}</Body>
        </div>
        <div>
          <Title size="xs">{'Deadline: '}</Title>
          <Body>{toShortTimeString(fetchedTask.deadline)}</Body>
        </div>
      </Panel>
      <Panel flex="column" margin fill>
        <Title>Statistics</Title>
        <div style={statRowStyle}>
          <Pie data={[{
            id: 'Completed',
            label: 'Completed',
            value: 65,
            color: raspberry,
          }, {
            id: 'Not Started',
            label: 'Not Started',
            value: 22,
            color: white,
          }, {
            id: 'Started',
            label: 'Started',
            value: 99,
            color: purple,
          }]}
          />
        </div>
        <div style={statRowStyle}>
          <Histogram
            title="Expected Time"
            data={[10, 20, 14, 12, 55, 11, 2, 122,
            ]}
          />
        </div>

        {/** Distribution of expected time */}
        {/** Distribution of time taken */}
      </Panel>
    </Page>
  );
}

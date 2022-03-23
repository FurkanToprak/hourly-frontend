import React from 'react';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import Label from '../components/utils/Label';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import { purple, raspberry, white } from '../styles/Theme';
import { toShortTimeString } from '../utils/Time';

export interface TaskItem {
  name: string;
  description: string;
  label: string;
  estimatedTime: string;
  deadline: Date;
  scheduled: Date[];
  id: string;
}

const rowStyle: React.CSSProperties = { marginBottom: 10 };

const statRowStyle: React.CSSProperties = { flex: 1, display: 'flex', marginTop: 10 };

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
        <Title>Title</Title>
        <div style={rowStyle}>
          <Title size="xs">{'Task: '}</Title>
          <Body>{fetchedTask.name}</Body>
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Label: '}</Title>
          <Label>{fetchedTask.label}</Label>
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Description: '}</Title>
          <Body>{fetchedTask.description}</Body>
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Estimated Time: '}</Title>
          <Body>{fetchedTask.estimatedTime}</Body>
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Deadline: '}</Title>
          <Body>{toShortTimeString(fetchedTask.deadline)}</Body>
        </div>
      </Panel>
      <Panel flex="column" margin fill>
        <Title>Statistics</Title>
        <div style={statRowStyle}>
          <Pie
            title="Task Completion"
            data={[{
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
            color={purple}
            title="Expected Time"
            data={[10, 20, 14, 12, 55, 11, 2, 122]}
          />
          <Histogram
            color={raspberry}
            title="Time Used"
            data={[192, 222, 343, 452, 5522, 241]}
          />
        </div>
      </Panel>
    </Page>
  );
}

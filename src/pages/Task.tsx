import React from 'react';
import Label from '../components/utils/Label';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import { toShortTimeString } from '../utils/Time';
import { TaskItem } from './Tasks';

const labelRowStyle: React.CSSProperties = {
  width: '100%', marginTop: 10, marginBottom: 10,
};

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
      <Title>Task</Title>
      <Panel flex="column" margin>
        <Body>{fetchedTask.name}</Body>
        <div style={labelRowStyle}><Label>{fetchedTask.label}</Label></div>
        <Title size="xs">{'Description: '}</Title>
        <Body>{fetchedTask.description}</Body>
        <Title size="xs">{'Estimated Time: '}</Title>
        <Body>{fetchedTask.estimatedTime}</Body>
        <Title size="xs">{'Deadline: '}</Title>
        <Body>{toShortTimeString(fetchedTask.deadline)}</Body>
      </Panel>
    </Page>
  );
}

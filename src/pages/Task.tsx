import React from 'react';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';
import { TaskItem } from './Tasks';

export default function Task() {
  const exampleTask: TaskItem = {
    name: 'string',
    description: 'string',
    label: 'string',
    estimatedTime: 'string',
    deadline: new Date(),
    scheduled: [new Date()],
    id: 'string',
  };
  return (
    <Page centerY fullHeight>
      <Title>Task</Title>
      <Panel centerY flex="column">
        <Title size="m">{exampleTask.name}</Title>
      </Panel>
    </Page>
  );
}

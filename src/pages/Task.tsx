import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import Label from '../components/utils/Label';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { purple, raspberry, white } from '../styles/Theme';
import { toShortTimeString } from '../utils/Time';

export interface TaskSchema {
  completed: 0 | 1;
  name: string;
  description: string;
  label: string;
  estimated_time: number;
  start_date: Date;
  due_date: Date;
  task_id: string;
  user_id: string;
}

const rowStyle: React.CSSProperties = { marginBottom: 10 };

const statRowStyle: React.CSSProperties = { flex: 1, display: 'flex', marginTop: 10 };

export default function Task() {
  const [fetchedTask, setFetchedTask] = useState(null as null | TaskSchema);
  const taskParams = useParams();
  const taskId = taskParams.taskid || '';
  const fetchTask = async () => {
    if (taskId.length === 0) {
      return;
    }
    const thisTask = await FlaskClient.post('tasks/getTaskById', { task_id: taskId });
    if (!thisTask) {
      return;
    }
    setFetchedTask(thisTask);
  };
  useEffect(() => {
    if (fetchedTask) {
      return;
    }
    fetchTask();
  }, [fetchedTask]);

  return (
    <Page fullHeight>
      { fetchedTask
      && (
      <Panel flex="column" margin>
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
          <Body>{`${fetchedTask.estimated_time} hours`}</Body>
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Due Date: '}</Title>
          <Body>{toShortTimeString(new Date(fetchedTask.due_date))}</Body>
        </div>
      </Panel>
      )}
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

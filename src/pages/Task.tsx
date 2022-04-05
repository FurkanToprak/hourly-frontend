import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Histogram from '../components/graphs/Histogram';
import Checkbox from '../components/utils/Checkbox';
import Label from '../components/utils/Label';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { purple, raspberry } from '../styles/Theme';
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
  const [complete, setComplete] = useState(false);
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
          <Checkbox
            label="Complete"
            labelPosition="end"
            isChecked={complete}
            onCheck={(newChecked) => {
              setComplete(newChecked);
            }}
          />
        </div>
        <div style={rowStyle}>
          <Title size="xs">{'Due Date: '}</Title>
          <Body>{toShortTimeString(new Date(fetchedTask.due_date))}</Body>
        </div>
      </Panel>
      )}
      <Panel flex="column" margin fill>
        <Title>Statistics</Title>
        <Histogram
          color={purple}
          title="Estimated Time"
          data={[10, 20, 14, 12, 55, 11, 2, 122]}
        />
        <Histogram
          color={raspberry}
          title="Actual Time"
          data={[192, 222, 343, 452, 5522, 241]}
        />
      </Panel>
    </Page>
  );
}

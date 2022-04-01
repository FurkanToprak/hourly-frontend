import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import { Navigate } from 'react-router-dom';
import DashboardCalendar, { EventSchema } from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Body, Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import { black, white } from '../styles/Theme';
import Modal from '../components/utils/Modal';
import { PurpleButton, RaspberryButton, StandardButton } from '../components/utils/Buttons';
import TimeSelect from '../components/calendar/TimeSelect';
import { useAuth } from '../contexts/Auth';
import Table from '../components/utils/Table';
import Panel from '../components/utils/Panel';
import StandardSelect from '../components/utils/Select';
import { StandardInput, StandardTimeInput } from '../components/utils/Inputs';
import { TaskSchema } from './Task';
import FlaskClient from '../connections/Flask';
import SettingsModal from '../components/calendar/SettingsModal';

export interface SnoozeSchema {
  startOfDay: string;
  endOfDay: string;
}
const rowStyle = {
  margin: 10, width: '50%',
};
const hoursToFloat = (inputHours: string): number => {
  const splitArr = inputHours.split(':');
  if (splitArr.length !== 2) {
    return Number(splitArr);
  }
  const hoursWhole = Number(splitArr[0]);
  const minsWhole = Number(splitArr[1]);
  return hoursWhole + minsWhole / 60;
};
export default function Dashboard() {
  const [tasks, setTasks] = useState(null as null | TaskSchema[]);
  const [events, setEvents] = useState(null as null | EventSchema[]);
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [openEvents, setOpenEvents] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const [taskScheduleError, setTaskScheduleError] = useState(null as null | TaskSchema);
  const [snooze, setSnooze] = useState(null as null | SnoozeSchema);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [label, setLabel] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const readyToSchedule = !Number.isNaN(estimatedTime)
    && name.length > 0 && description.length > 0 && label.length > 0;
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  const fetchEvents = async (userId: string) => {
    if (tasks !== null) {
      return;
    }
    const fetchedEvents: { events: EventSchema[]} = await FlaskClient.post('events/getEvents', { user_id: userId });
    setEvents(fetchedEvents.events);
  };
  const fetchTasks = async (userId: string) => {
    if (tasks !== null) {
      return;
    }
    const fetchedTasks: { tasks: TaskSchema[]} = await FlaskClient.post('tasks/getUserTasks', { user_id: userId });
    setTasks(fetchedTasks.tasks);
  };
  const deleteTask = async (taskId: string) => {
    await FlaskClient.post('tasks/deleteTask', {
      task_id: taskId,
    });
  };
  const fetchSnooze = async (userId: string) => {
    if (snooze !== null) {
      return;
    }
    const fetchedSnooze: SnoozeSchema = await FlaskClient.post('users/getSleep', { user_id: userId });
    setSnooze(fetchedSnooze);
  };
  useEffect(() => {
    fetchEvents(user.id);
  }, [events]);
  useEffect(() => {
    fetchTasks(user.id);
  }, [tasks]);
  useEffect(() => {
    fetchSnooze(user.id);
  }, [snooze]);

  const cramTask = async () => {
    if (taskScheduleError === null) {
      return;
    }
    await FlaskClient.post('tasks/cramTask', {
      task_id: taskScheduleError.task_id,
    });
    // TODO: never tested
    setTaskScheduleError(null);
  };
  return (
    <Page fullHeight centerY>
      <Modal open={openCalendarModal} onClose={() => { setOpenCalendarModal(false); }}>
        <Title size="l">Import Calendar</Title>
        <StandardButton variant="outlined">Connect Google Calendar</StandardButton>
      </Modal>
      <Modal
        open={taskScheduleError !== null}
        onClose={() => {
          setTaskScheduleError(null);
          cramTask();
        }}
      >
        <Title size="l">Oops!</Title>
        <Body>
          {"You don't have enough time for this task. \
          We'll save the task for you, but we can't fit it in your schedule."}
        </Body>
        <RaspberryButton
          style={{ marginTop: 10, marginBottom: 10 }}
          fullWidth
          variant="outlined"
          onMouseDown={() => {
            if (taskScheduleError === null) {
              return;
            }
            deleteTask(taskScheduleError.task_id);
          }}
        >
          Cancel Task
        </RaspberryButton>
        <PurpleButton
          fullWidth
          variant="outlined"
          onMouseDown={() => {
            if (taskScheduleError === null) {
              return;
            }
            FlaskClient.post('tasks/cramTask', { task_id: taskScheduleError.task_id });
          }}
        >
          Cram Task
        </PurpleButton>
      </Modal>
      <SettingsModal open={openSettingsModal} onClose={() => { setOpenSettingsModal(false); }} />
      <Modal open={openEvents} onClose={() => { setOpenEvents(false); }}>
        <Title size="l">Events</Title>
        {events !== null && (
        <Table
          keys={['name', 'repeat', 'start_time', 'end_time']}
          columns={['Name', 'Repeats?', 'Start Time', 'End Time']}
          items={events}
          emptyMessage="No scheduled events"
        />
        )}

      </Modal>
      <Modal
        open={openTasks}
        onClose={() => {
          setOpenTasks(false);
          setOpenAddTask(false);
          setName('');
          setDescription('');
          setLabel('');
          setEstimatedTime('');
          setDueDate(new Date());
        }}
      >
        <Title size="l">Tasks</Title>
        {openAddTask ? (
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
                label="Estimated Time (HH:MM)" // TODO: change to half-hour intervals
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
              <TimeSelect
                default={new Date()}
                label="Due Date (MM/DD/YYYY)"
                onDateChange={(newDate) => {
                  setDueDate(newDate);
                }}
              />
            </div>
            <div style={rowStyle}>
              <StandardButton
                disabled={!readyToSchedule}
                variant="outlined"
                fullWidth
                onMouseDown={async () => {
                  if (!readyToSchedule || tasks === null) {
                    return;
                  }
                  const payload: TaskSchema = {
                    name,
                    description,
                    label,
                    start_date: new Date(),
                    due_date: dueDate,
                    estimated_time: hoursToFloat(estimatedTime),
                    task_id: '',
                    user_id: user.id,
                    completed: 0,
                  };
                  // send payload
                  const createdTask: TaskSchema = await FlaskClient.post('tasks/createTask', payload);
                  const scheduledTask = await FlaskClient.post('schedule', { user_id: user.id });
                  if (scheduledTask.failed) {
                    setTaskScheduleError(createdTask);
                  }
                  const freshTasks = tasks.slice();
                  freshTasks.push(createdTask);
                  setTasks(freshTasks);
                }}
              >
                Schedule
              </StandardButton>
            </div>
          </Panel>
        )
          : (
            <PurpleButton
              fullWidth
              onMouseDown={() => {
                setOpenAddTask(true);
              }}
              variant="outlined"
            >
              +
            </PurpleButton>
          )}
        {tasks !== null && (
        <Table
          urlPrefix="task"
          keys={['name', 'description', 'label', 'due_date', 'completed']}
          columns={['Name', 'Description', 'Label', 'Due Date', 'Completed']}
          items={tasks}
          emptyMessage="No scheduled tasks"
        />
        )}
      </Modal>
      <Title>Dashboard</Title>
      <div style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', marginLeft: 40, marginRight: 40,
      }}
      >
        <SettingsIcon
          fontSize="large"
          style={{ cursor: 'pointer', color: themeFont }}
          onMouseDown={() => {
            setOpenSettingsModal(true);
          }}
        />
        <StandardButton
          variant="outlined"
          onMouseDown={() => {
            setOpenEvents(true);
          }}
        >
          Events
        </StandardButton>
        <StandardButton
          variant="outlined"
          onMouseDown={() => {
            setOpenTasks(true);
          }}
        >
          Tasks
        </StandardButton>
        <DownloadIcon
          fontSize="large"
          style={{ cursor: 'pointer', color: themeFont }}
          onMouseDown={() => {
            // Google Calendar Import
            setOpenCalendarModal(true);
          }}
        />
      </div>
      <DashboardCalendar snooze={snooze} />
    </Page>
  );
}

import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { Navigate } from 'react-router-dom';
import DashboardCalendar from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import { black, white } from '../styles/Theme';
import Modal from '../components/utils/Modal';
import { PurpleButton, StandardButton } from '../components/utils/Buttons';
import TimeSelect from '../components/calendar/TimeSelect';
import { useAuth } from '../contexts/Auth';
import Table from '../components/utils/Table';
import Panel from '../components/utils/Panel';
import StandardSelect from '../components/utils/Select';
import { StandardInput, StandardTimeInput } from '../components/utils/Inputs';
import { TaskItem } from './Task';
import FlaskClient from '../connections/Flask';
import { toShortTimeString } from '../utils/Time';

const rowStyle = {
  margin: 10, width: '50%',
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([] as TaskItem[]);
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [openEvents, setOpenEvents] = useState(false);
  const [openTasks, setOpenTasks] = useState(false);
  const [openAddTask, setOpenAddTask] = useState(false);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
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
  const fetchTasks = async (userId: string) => {
    if (tasks.length > 0) {
      return;
    }
    const fetchedTasks: { tasks: TaskItem[]} = await FlaskClient.post('tasks/getTasks', { id: userId });
    setTasks(fetchedTasks.tasks);
  };
  useEffect(() => {
    fetchTasks(user.id);
  }, [tasks]);
  const [startTime, setStartTime] = useState(user.startOfDay);
  const [endTime, setEndTime] = useState(user.endOfDay);
  return (
    <Page fullHeight centerY>
      <Modal open={openCalendarModal} onClose={() => { setOpenCalendarModal(false); }}>
        <Title size="l">Import Calendar</Title>
        <StandardButton variant="outlined">Connect Google Calendar</StandardButton>
      </Modal>
      <Modal open={openSettingsModal} onClose={() => { setOpenSettingsModal(false); }}>
        <Title size="l">Settings</Title>
        <div style={{
          marginTop: 10, width: '100%', display: 'flex', justifyContent: 'space-between',
        }}
        >
          <TimeSelect default={startTime} showTimeSelectOnly label="Do not work before" onTimeChange={(newTime) => { setStartTime(newTime); }} />
          <div style={{ width: 20 }} />
          <TimeSelect default={endTime} showTimeSelectOnly label="Do not work after" onTimeChange={(newTime) => { setEndTime(newTime); }} />
          <StandardButton style={{ marginLeft: 10 }} variant="outlined">
            <WorkOffIcon
              fontSize="large"
              style={{
                cursor: 'pointer', color: themeFont,
              }}
            />
          </StandardButton>
        </div>
      </Modal>
      <Modal open={openEvents} onClose={() => { setOpenEvents(false); }}>
        <Title size="l">Events</Title>
        <Table
          urlPrefix="task"
          keys={['name', 'description', 'label', 'due date']}
          columns={['Name', 'Description', 'Label', 'Due Date']}
          items={tasks}
          emptyMessage="No scheduled events"
        />
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
              <TimeSelect
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
                  if (!readyToSchedule) {
                    return;
                  }
                  const payload: TaskItem = {
                    name,
                    description,
                    label,
                    start_date: toShortTimeString(new Date()),
                    due_date: toShortTimeString(dueDate),
                    estimated_time: estimatedTime,
                    id: '',
                    user_id: user.id,
                    completed: 0,
                  };
                  // send payload
                  const createdTask = await FlaskClient.post('tasks/createTask', payload);
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
        <Table
          urlPrefix="task"
          keys={['name', 'description', 'label', 'due date']}
          columns={['Name', 'Description', 'Label', 'Due Date']}
          items={tasks}
          emptyMessage="No scheduled tasks"
        />
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
      <DashboardCalendar />
    </Page>
  );
}

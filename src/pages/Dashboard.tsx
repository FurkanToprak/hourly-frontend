import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import { Navigate } from 'react-router-dom';
import DashboardCalendar, { DisplayedEvent, EventSchema } from '../components/calendar/DashboardCalendar';
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
import { StandardInput } from '../components/utils/Inputs';
import { TaskSchema } from './Task';
import FlaskClient from '../connections/Flask';
import SettingsModal from '../components/calendar/SettingsModal';

export interface SnoozeSchema {
  startOfDay: string;
  endOfDay: string;
}
type ExpiredTaskSchema = TaskSchema | {hours: number};
const rowStyle = {
  margin: 10, width: '50%', display: 'flex',
};

export default function Dashboard() {
  const [tasks, setTasks] = useState(null as null | ExpiredTaskSchema[]);
  const [expiredTasks, setExpiredTasks] = useState(null as null | ExpiredTaskSchema[]);
  const [events, setEvents] = useState(null as null | EventSchema[]);
  const [calendarEvents, setCalendarEvents] = useState(null as null | DisplayedEvent[]);
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
  const [estimatedHours, setEstimatedHours] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [taskLabels, setTaskLabels] = useState(null as null | string[]);
  const readyToSchedule = estimatedMinutes !== '' && estimatedHours !== ''
    && name.length > 0 && description.length > 0 && label.length > 0;
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  const fetchEvents = async (userId: string) => {
    if (events !== null) {
      return;
    }
    const fetchedEvents: { events: EventSchema[]} = await FlaskClient.post('events/getEvents', { user_id: userId });
    setEvents(fetchedEvents.events);
  };
  const fetchExpiredTasks = async (userId: string) => {
    const expiredResponse: { expired_tasks: (ExpiredTaskSchema)[]} = await FlaskClient.post('/blocks/expiredSubTasks', {
      user_id: userId,
    });
    if (expiredTasks !== null) {
      return;
    }
    setExpiredTasks(expiredResponse.expired_tasks);
  };
  const fetchTasks = async (userId: string) => {
    if (tasks !== null) {
      return;
    }
    const fetchedTaskLabels: { labels: string[] } = await FlaskClient.post('groups/getUsersLabels', {
      user_id: user.id,
    });
    const fetchedTasks: { tasks: TaskSchema[]} = await FlaskClient.post('tasks/getUserTasks', { user_id: userId });
    setTaskLabels(fetchedTaskLabels.labels);
    setTasks(fetchedTasks.tasks);
  };
  const deleteTask = async (taskId: string) => {
    await FlaskClient.post('tasks/deleteTask', {
      task_id: taskId,
    });
    setTaskScheduleError(null);
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
    fetchExpiredTasks(user.id);
    fetchTasks(user.id);
  }, [tasks]);
  useEffect(() => {
    fetchSnooze(user.id);
  }, [snooze]);
  console.log('taskScheduleError');
  console.log(taskScheduleError);
  const labelDictionary = taskLabels ? new Map(taskLabels.map(
    ((taskLabel) => [taskLabel, taskLabel]),
  ))
    : new Map();
  const deleteEvent = async (deletedEvent: EventSchema) => {
    await FlaskClient.post('events/deleteEvent', {
      event_id: deletedEvent.id,
    });
    await FlaskClient.post('schedule', {
      user_id: user.id,
    });
    setEvents(null);
    setCalendarEvents(null);
  };
  const cramTask = async () => {
    if (taskScheduleError === null) {
      return;
    }
    await FlaskClient.post('tasks/cramTask', { task_id: taskScheduleError.id });
    await FlaskClient.post('schedule', { user_id: user.id });
    // TODO: never tested
    setTaskScheduleError(null);
  };
  const expiredExists = expiredTasks !== null && expiredTasks.length > 0;
  return (
    <Page fullHeight centerY>
      <Modal
        open={expiredExists}
        onClose={() => {
          setExpiredTasks([]);
        }}
      >
        <div />
      </Modal>
      {
        expiredTasks && (
        <>
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
                deleteTask(taskScheduleError.id);
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
                cramTask();
              }}
            >
              Cram Task
            </PurpleButton>
          </Modal>
          <SettingsModal
            open={openSettingsModal}
            onClose={() => { setOpenSettingsModal(false); }}
          />
          <Modal open={openEvents} onClose={() => { setOpenEvents(false); }}>
            <Title size="l">Events</Title>
            {events !== null && (
            <Table
              onDelete={(deletedEvent) => {
                deleteEvent(deletedEvent);
              }}
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
              setEstimatedHours('');
              setEstimatedMinutes('');
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
                  <div style={{ display: 'flex', alignItems: 'center', marginRight: 10 }}>
                    <Body>Estimated Time</Body>
                  </div>
                  <div style={{ flex: 1 }}>
                    <StandardSelect
                      label="Hours"
                      values={new Map<string, any>(Object.entries({
                        0: '00',
                        1: '01',
                        2: '02',
                        3: '03',
                        4: '04',
                        5: '05',
                        6: '06',
                        7: '07',
                        8: '08',
                        9: '09',
                        10: '10',
                      }))}
                      onSelect={(select: string) => {
                        setEstimatedHours(select);
                      }}
                    />
                  </div>
                  <div style={{ width: 10 }} />
                  <div style={{ flex: 1 }}>
                    <StandardSelect
                      label="Minutes"
                      values={new Map<string, any>(Object.entries({
                        '00': '0',
                        30: '30',
                      }))}
                      onSelect={(select: string) => {
                        setEstimatedMinutes(select);
                      }}
                    />
                  </div>
                </div>
                <div style={rowStyle}>
                  <div style={{ flex: 1 }}>
                    <StandardSelect
                      label="Label"
                      values={labelDictionary}
                      onSelect={(select: string) => {
                        setLabel(select);
                      }}
                    />
                  </div>
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
                        estimated_time: Number(estimatedHours) + Number(estimatedMinutes) / 60,
                        id: '',
                        user_id: user.id,
                        completed: 0,
                        do_not_schedule: false,
                      };
                      const createdTask: TaskSchema = await FlaskClient.post('tasks/createTask', payload);
                      const scheduledTask = await FlaskClient.post('schedule', { user_id: user.id });
                      if (scheduledTask.failed) {
                        setTaskScheduleError(createdTask);
                      }
                      const freshTasks = tasks.slice();
                      freshTasks.push(createdTask);
                      setTasks(freshTasks);
                      setCalendarEvents(null);
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
                setEvents(null);
              }}
            >
              Events
            </StandardButton>
            <StandardButton
              variant="outlined"
              onMouseDown={() => {
                setOpenTasks(true);
                setTasks(null);
              }}
            >
              Tasks
            </StandardButton>
            <DownloadIcon
              fontSize="large"
              style={{ cursor: 'pointer', color: themeFont }}
              onMouseDown={() => {
                // Google Calendar Export
                setOpenCalendarModal(true);
              }}
            />
          </div>
          <DashboardCalendar
            snooze={snooze}
            events={calendarEvents}
            setEvents={setCalendarEvents}
          />
        </>
        )
      }
    </Page>
  );
}

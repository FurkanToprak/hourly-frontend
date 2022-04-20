import React, { useEffect, useRef, useState } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import SettingsIcon from '@mui/icons-material/Settings';
import { Navigate } from 'react-router-dom';
import moment from 'moment';
import DashboardCalendar, { DisplayedEvent, EventSchema } from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Body, Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import {
  black, white,
} from '../styles/Theme';
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
import TasksLeft from '../components/calendar/TasksLeft';
import Checkbox from '../components/utils/Checkbox';

export interface SnoozeSchema {
  startOfDay: string;
  endOfDay: string;
}
export type ExpiredTaskSchema = TaskSchema & {hours: number};
const rowStyle = { margin: 10, width: '50%', display: 'flex' };

const titleOptions = ['Working hard or hardly working?', 'A sight for sore eyes!', 'How was your day?', 'What have you been up to?', 'Welcome back!', 'What\'s new?', 'Hey there champ!'];

const titleText = titleOptions[Math.floor(Math.random() * titleOptions.length)];

export interface ExpiredSchema {
  expired_tasks: (ExpiredTaskSchema)[];
  past_due_tasks: (ExpiredTaskSchema)[];
}

export default function Dashboard() {
  const [tasks, setTasks] = useState(null as null | TaskSchema[]);
  const [expiredTasks, setExpiredTasks] = useState(null as null | ExpiredSchema);
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
  const [help, setHelp] = useState(false);
  const [taskLabels, setTaskLabels] = useState(null as null | string[]);
  const [completedFiltered, setCompletedFiltered] = useState(true);
  const [uploadMessage, setUploadMessage] = useState('');
  const readyToSchedule = estimatedMinutes !== '' && estimatedHours !== ''
    && name.length > 0 && description.length > 0;
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
    if (expiredTasks !== null) {
      return;
    }
    const expiredResponse: ExpiredSchema = await
    FlaskClient.post('blocks/expiredSubTasks', {
      user_id: userId,
    });
    setExpiredTasks(expiredResponse);
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
  const icsRef = useRef(null);
  useEffect(() => {
    fetchEvents(user.id);
  }, [events]);
  useEffect(() => {
    fetchTasks(user.id);
  }, [tasks]);
  useEffect(() => {
    fetchExpiredTasks(user.id);
  }, [expiredTasks]);
  useEffect(() => {
    fetchSnooze(user.id);
  }, [snooze]);
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
  const scheduleExpired = async () => {
    await FlaskClient.post('schedule', { user_id: user.id });
    setCalendarEvents(null);
    setTasks(null);
    setExpiredTasks(null);
  };
  const cramTask = async () => {
    if (taskScheduleError === null) {
      return;
    }
    await FlaskClient.post('tasks/cramTask', { task_id: taskScheduleError.id });
    await FlaskClient.post('schedule', { user_id: user.id });
    setTaskScheduleError(null);
  };
  const uploadIcs = async (file: File) => {
    const sixMonthsAgo = moment().subtract(6, 'months').toISOString();
    const bodyFormData = new FormData();
    bodyFormData.append('user_id', user.id);
    bodyFormData.append('start_point', sixMonthsAgo);
    bodyFormData.append('ics_file', file);
    const uploadResponse: {success: true} = await FlaskClient.postFormData('events/uploadICS', bodyFormData);
    setUploadMessage('Uploading .ics...');
    if (uploadResponse.success) {
      await FlaskClient.post('schedule', { user_id: user.id });
      setUploadMessage('Success!');
    } else {
      setUploadMessage('Error uploading .ics.');
    }
  };
  const expiredExists = expiredTasks !== null
  && (expiredTasks.expired_tasks.length > 0 || expiredTasks.past_due_tasks.length > 0);
  return (
    <Page fullHeight centerY>
      <Modal
        open={expiredExists}
        onClose={() => {
          // do nothing, the button controls the modal
        }}
      >
        <Title>
          {titleText}
        </Title>
        <Body>
          Click the checkmark
          to confirm you sticked to your schedule, or make
          changes if you changed your plans.
        </Body>
        {expiredExists && <TasksLeft expiredTasks={expiredTasks} />}
        <RaspberryButton
          onMouseDown={() => {
            scheduleExpired();
          }}
          fullWidth
          variant="outlined"
        >
          Reschedule remaining tasks
        </RaspberryButton>
      </Modal>
      <Modal open={openCalendarModal} onClose={() => { setOpenCalendarModal(false); }}>
        <Title size="l">Import Calendar</Title>
        <input
          id="ics_file"
          accept=".ics"
          type="file"
          hidden
          ref={icsRef}
          onChange={(e) => {
            if (e === null || e.target === null
                || e.target.files === null) {
              return;
            }
            const uploadedFile = e.target.files[0];
            uploadIcs(uploadedFile);
          }}
        />
        <StandardButton
          variant="outlined"
          onMouseDown={() => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            icsRef.current.click();
          }}
        >
          {uploadMessage || 'Select Calendar File [.ics]'}
        </StandardButton>
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
        onClose={() => {
          setOpenSettingsModal(false);
          setSnooze(null);
        }}
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
        open={help}
        onClose={() => {
          setHelp(false);
        }}
      >
        <Title>Help</Title>
        <Title size="m">Dashboard</Title>
        <Body>This is the interface where you can view your events and tasks.</Body>
        <Body>You can import your calendar by uploading an .ics file.</Body>
        <Title size="m">Tasks</Title>
        <Body>You can automatically schedule your to-do list by creating a task.</Body>
        <Body>Click on a red task on the calendar to complete it.</Body>
        <Body>
          You can complete a task session or complete the whole task.
        </Body>
        <Body>Select a label to associate the task with a group.</Body>
        <Title size="m">Events</Title>
        <Body>Create an event with the input box below the calendar.</Body>
        <Body>Delete events from the events menu.</Body>
        <Title size="m">Settings</Title>
        <Body>You can reset your account and specify your work hours from this menu.</Body>
        <Body>
          You will not work on tasks
          or have meetings with collaborators outside of your work hours.
        </Body>
        <Title size="m">Groups</Title>
        <Body>
          You can join a group to compare your productivity with
          your peers.
        </Body>
        <Body>
          You can create a group and share an invite code with your friends who want to join.
        </Body>
        <Body>You can make friends and invite them to collaborate.</Body>
        <Body>Tasks associated with a group are tracked for productivity statistics.</Body>
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
                  setTasks(null);
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
        <div style={{ width: '100%', display: 'flex', justifyContent: 'right' }}>
          <Checkbox
            label="Filter Completed"
            isChecked={completedFiltered}
            onCheck={(newChecked) => {
              setCompletedFiltered(newChecked);
            }}
          />
        </div>
        {tasks !== null && (
        <Table
          mini
          urlPrefix="task"
          keys={['name', 'description', 'label', 'due_date', 'completed']}
          columns={['Name', 'Description', 'Label', 'Due Date', 'Completed']}
          items={completedFiltered ? tasks.filter((task) => !task.completed) : tasks}
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
          onMouseDown={() => {
            setHelp(true);
          }}
          variant="outlined"
        >
          Help
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
        <UploadIcon
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
    </Page>
  );
}

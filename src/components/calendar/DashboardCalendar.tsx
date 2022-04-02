import React, { useEffect, useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import Panel from '../utils/Panel';
import '../../styles/DashboardCalendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { StandardInput } from '../utils/Inputs';
import TimeSelect from './TimeSelect';
import { StandardButton } from '../utils/Buttons';
import { Title } from '../utils/Texts';
import { useTheme } from '../../contexts/Theme';
import {
  black, darkBorder, lightBorder, purple, raspberry, white,
} from '../../styles/Theme';
import FlaskClient from '../../connections/Flask';
import { useAuth } from '../../contexts/Auth';
import { SnoozeSchema } from '../../pages/Dashboard';

const localizer = momentLocalizer(moment);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

const inputStyle: React.CSSProperties = {
  margin: 10,
};
const fullRowStyle = { width: '100%', display: 'flex', marginBottom: 10 };
const calendarStyle = { margin: 10, minHeight: 500 };

export interface EventSchema {
  id: string;
  completed: number;
  start_time: string;
  end_time: string;
  type: string;
  task_id: string;
  repeat: string;
  name: string;
}

export default function DashboardCalendar(props: {
  snooze: null | SnoozeSchema;
}) {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null as null | Date);
  const [endDate, setEndDate] = useState(null as null | Date);
  const [events, setEvents] = useState(null as null | Event[]);
  const [scheduleError, setScheduleError] = useState(false);
  const eventReady = eventTitle !== '' && startDate !== null && endDate !== null;
  const { user } = useAuth();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  if (!user) {
    return <div />;
  }
  const fetchEvents = async () => {
    if (events !== null) {
      return;
    }
    const getEvents = await FlaskClient.post('blocks/getBlocks', {
      user_id: user.id,
    });
    const fetchedBlocks: EventSchema[] = getEvents.blocks;
    const convertedBlocks = fetchedBlocks.map((fetchedBlock) => ({
      title: fetchedBlock.name,
      start: moment(fetchedBlock.start_time).toDate(),
      end: moment(fetchedBlock.end_time).toDate(),
      type: fetchedBlock.type,
    } as Event));
    setEvents(convertedBlocks);
  };
  const postEvent = async () => {
    if (!eventTitle || !startDate || !endDate) {
      return;
    }
    const createdEvent = await FlaskClient.post('events/createEvent', {
      id: '',
      user_id: user.id,
      task_id: '',
      name: eventTitle,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      repeat: '',
      completed: 0,
      type: 'EVENT',
    } as EventSchema);
    const scheduleResponse = await FlaskClient.post('schedule', { user_id: user.id });
    if (scheduleResponse.failed) {
      setScheduleError(true);
      // TODO: never checked
      await FlaskClient.post('events/deleteEvent', {
        event_id: createdEvent.id,
        user_id: user.id,
      });
    }
    setEventTitle('');
    setStartDate(null);
    setEndDate(null);
    setEvents(null);
  };
  useEffect(() => {
    fetchEvents();
  }, [events]);
  let buttonText;
  if (scheduleError) {
    buttonText = 'Conflicts With Your Schedule!';
  } else {
    buttonText = 'Create Event';
  }
  return (
    <Panel centerY flex="column" fill>
      <div style={{ width: '95%', flex: 1, marginBottom: 10 }}>
        {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
       * @ts-ignore */}
        <DnDCalendar
          min={props.snooze ? new Date(props.snooze.startOfDay) : undefined}
          max={props.snooze ? new Date(props.snooze.endOfDay) : undefined}
          defaultDate={moment().toDate()}
          defaultView="week"
          views={{
            day: true, week: true, month: true,
          }}
          localizer={localizer}
          events={events || []}
          startAccessor="start"
          endAccessor="end"
          resizable
          eventPropGetter={(event) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isEvent = event.type === 'EVENT';
            return {
              style: {
                backgroundColor: isEvent ? purple : raspberry,
                border: themeBorder,
              },
            };
          }}
          style={{ color: themeFont, ...calendarStyle }}
        />
      </div>
      <Panel centerY flex="column" margin>
        <StandardInput
          label="Title"
          value={eventTitle}
          style={inputStyle}
          fullWidth
          onChange={(e) => {
            setEventTitle(e.target.value);
          }}
        />
        <div style={fullRowStyle}>
          <TimeSelect
            default={startDate || new Date()}
            label="Start Time"
            onDateChange={(newDate) => {
              setStartDate(newDate);
            }}
          />
        </div>
        <div style={fullRowStyle}>
          <TimeSelect
            default={endDate || new Date()}
            label="End Time"
            onDateChange={(newDate) => {
              setEndDate(newDate);
            }}
          />
        </div>
        <StandardButton
          fullWidth
          disabled={!eventReady}
          variant="outlined"
          onMouseDown={() => {
            if (!eventReady) {
              return;
            }
            postEvent();
          }}
        >
          {buttonText}
        </StandardButton>
      </Panel>
    </Panel>
  );
}

import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import Panel from '../utils/Panel';
import '../../styles/DashboardCalendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { StandardInput } from '../utils/Inputs';
import TimeSelect from './TimeSelect';
import { PurpleButton, StandardButton } from '../utils/Buttons';
import { useTheme } from '../../contexts/Theme';
import {
  black, darkBorder, darkPurple, darkRaspberry,
  lightBorder, lightPurple, lightRaspberry,
  purple, raspberry, white,
} from '../../styles/Theme';
import FlaskClient from '../../connections/Flask';
import { useAuth } from '../../contexts/Auth';
import { SnoozeSchema } from '../../pages/Dashboard';
import Checkbox from '../utils/Checkbox';
import WeekSelector from '../utils/WeekSelector';
import { Body, Title } from '../utils/Texts';
import Modal from '../utils/Modal';

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

interface DisplayedEvent {
  title: string;
  start: Date;
  end: Date;
  type: string;
  task_id: string;
  id: string;
  completed: 0 | 1;
}

function CustomEvent(props: any) {
  console.log('hello');
  console.log(props);
  return <div>HI</div>;
}

export default function DashboardCalendar(props: {
  snooze: null | SnoozeSchema;
}) {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  // input
  const [selectedEvent, setSelectedEvent] = useState(null as null | DisplayedEvent);
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null as null | Date);
  const [endDate, setEndDate] = useState(null as null | Date);
  const [repeatsEnabled, setRepeatsEnabled] = useState(false);
  const [repeats, setRepeats] = useState('');
  const [repeatDays, setRepeatDays] = useState('');
  // events, errors, auth
  const [events, setEvents] = useState(null as null | DisplayedEvent[]);
  const [scheduleError, setScheduleError] = useState(false);
  const eventReady = eventTitle !== '' && startDate !== null && endDate !== null;
  const { user } = useAuth();
  const themeBorder = theme === 'light' ? lightBorder : darkBorder;
  const [complete, setComplete] = useState(false);
  const [completeWhole, setCompleteWhole] = useState(false);
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
      task_id: fetchedBlock.task_id,
      id: fetchedBlock.id,
      completed: fetchedBlock.completed,
    } as DisplayedEvent));
    setEvents(convertedBlocks);
  };
  const postEvent = async () => {
    if (!eventTitle || !startDate || !endDate) {
      return;
    }
    let repeatValue = '';
    if (repeats === 'MONTHLY') {
      repeatValue = repeats;
    } else if (repeats === 'daily') {
      repeatValue = 'MTWRSFU';
    } else if (repeats.length > 0) {
      repeatValue = repeatDays;
    }
    const createdEvent = await FlaskClient.post('events/createEvent', {
      id: '',
      user_id: user.id,
      task_id: '',
      name: eventTitle,
      start_time: startDate.toISOString(),
      end_time: endDate.toISOString(),
      repeat: repeatValue,
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
      <Modal open={selectedEvent !== null && selectedEvent.type === 'TASK'} onClose={() => { setSelectedEvent(null); }}>
        {(selectedEvent === null)
          ? <div /> : (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            >
              <Title size="xs">
                {selectedEvent.type}
              </Title>
              <Body size="l">
                {selectedEvent.title}
              </Body>
              <Checkbox
                label="Complete"
                labelPosition="end"
                isChecked={complete}
                onCheck={(newChecked) => {
                  setComplete(newChecked);
                }}
              />
              <Checkbox
                label="Complete All"
                labelPosition="end"
                isChecked={completeWhole}
                onCheck={(newChecked) => {
                  setComplete(newChecked);
                  setCompleteWhole(newChecked);
                }}
              />
              <PurpleButton
                variant="outlined"
                onMouseDown={() => {
                  //
                }}
              >
                {`Update ${selectedEvent.type}`}
              </PurpleButton>
            </div>
          )}
      </Modal>
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
          onSelectEvent={(event: DisplayedEvent) => {
            setSelectedEvent(event);
          }}
          eventPropGetter={(event: DisplayedEvent) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const isEvent = event.type === 'EVENT';
            const startEvent = new Date(event.start);
            const endEvent = new Date(event.end);
            const nowDate = new Date();
            const eventIsPast = endEvent < nowDate;
            const eventIsOngoing = startEvent < nowDate && endEvent > nowDate;
            let eventColor = white;
            if (isEvent) {
              if (eventIsPast) {
                eventColor = lightPurple;
              } else if (eventIsOngoing) {
                eventColor = darkPurple;
              } else {
                eventColor = purple;
              }
            } else if (eventIsPast) {
              eventColor = lightRaspberry;
            } else if (eventIsOngoing) {
              eventColor = darkRaspberry;
            } else {
              eventColor = raspberry;
            }
            return {
              style: {
                backgroundColor: eventColor,
                border: themeBorder,
              },
            };
          }}
          style={{ color: themeFont, ...calendarStyle }}
          formats={{ eventTimeRangeFormat: () => null }}
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
        <div style={fullRowStyle}>
          <Checkbox
            label="Repeats?"
            onCheck={(newCheck: boolean) => {
              setRepeatsEnabled(newCheck);
              setRepeats('');
            }}
            isChecked={repeatsEnabled}
          />
          { repeatsEnabled
            && (
            <>
              <Checkbox
                label="Daily"
                checkColor={raspberry}
                onCheck={(newCheck: boolean) => {
                  if (newCheck) {
                    setRepeats('daily');
                  } else {
                    setRepeats('');
                  }
                }}
                isChecked={repeats === 'daily'}
              />
              <Checkbox
                label="Weekly"
                checkColor={raspberry}
                onCheck={(newCheck: boolean) => {
                  if (newCheck) {
                    setRepeats('weekly');
                  } else {
                    setRepeats('');
                  }
                }}
                isChecked={repeats === 'weekly'}
              />
              <Checkbox
                label="Monthly"
                checkColor={raspberry}
                onCheck={(newCheck: boolean) => {
                  if (newCheck) {
                    setRepeats('MONTHLY');
                  } else {
                    setRepeats('');
                  }
                }}
                isChecked={repeats === 'MONTHLY'}
              />
            </>
            )}
        </div>
        <div style={{ marginBottom: 10 }}>
          { repeats === 'weekly' && (
          <WeekSelector onChange={(newDaysOfWeek) => {
            setRepeatDays(newDaysOfWeek);
          }}
          />
          )}
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

import React, { useState } from 'react';
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
import { black, white } from '../../styles/Theme';

const localizer = momentLocalizer(moment);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

const inputStyle: React.CSSProperties = {
  margin: 10,
};
const cancelButtonStyle = { marginTop: 10 };
const fullRowStyle = { width: '100%', display: 'flex', marginBottom: 10 };
const calendarStyle = { margin: 10 };

function createTimeSlot(props: {
  value: Date;
  resource: null;
  children: any
}) {
  // console.log('props');
  // console.log(props.value.get);
  // props.
  return <div style={{ border: '1px solid red' }} />;
}

export default function DashboardCalendar() {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [selectedEvent, setSelectedEvent] = useState(null as null | Event);
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null as null | Date);
  const [endDate, setEndDate] = useState(null as null | Date);
  const [events, setEvents] = useState([] as Event[]);
  const eventReady = eventTitle !== '' && startDate !== null && endDate !== null;
  return (
    <Panel centerY flex="column" fill>
      <div style={{ width: '95%', flex: 1 }}>
        {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
       * @ts-ignore */}
        <DnDCalendar
          defaultDate={moment().toDate()}
          defaultView="week"
          onEventDrop={(droppedEvent) => {
            const oldEvent = droppedEvent.event as Event;
            const freshEvents = events.slice().filter((value) => value !== oldEvent);
            freshEvents.push({
              start: new Date(droppedEvent.start),
              end: new Date(droppedEvent.end),
              title: oldEvent.title,
            });
            setEvents(freshEvents);
          }}
          onEventResize={(resizedEvent) => {
            const oldEvent = resizedEvent.event as Event;
            const freshEvents = events.slice().filter((value) => value !== oldEvent);
            freshEvents.push({
              start: new Date(resizedEvent.start),
              end: new Date(resizedEvent.end),
              title: oldEvent.title,
            });
            setEvents(freshEvents);
          }}
          onSelectEvent={(event: Event) => {
            setSelectedEvent(event);
            setStartDate(event.start as Date);
            setEndDate(event.end as Date);
          }}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          resizable
          style={{ color: themeFont, ...calendarStyle }}
        />
      </div>
      <Panel centerY flex="column" margin>
        <Title size="s">{selectedEvent ? 'Edit Event' : 'Create Event'}</Title>
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
            label="Start Time"
            onDateChange={(newDate) => {
              setStartDate(newDate);
            }}
          />
        </div>
        <div style={fullRowStyle}>
          <TimeSelect
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
            let freshEvents;
            if (selectedEvent) {
              freshEvents = events.filter((event) => event !== selectedEvent);
            } else {
              freshEvents = events;
            }

            freshEvents.push({
              start: startDate as Date,
              end: endDate as Date,
              title: eventTitle,
            });
            setEvents(freshEvents);
          }}
        >
          {selectedEvent ? 'Edit' : 'Create'}
        </StandardButton>
        { selectedEvent
        && (
        <StandardButton
          style={cancelButtonStyle}
          variant="outlined"
          fullWidth
          onMouseDown={() => {
            setSelectedEvent(null);
            setEventTitle('');
            setStartDate(null);
            setEndDate(null);
          }}
        >
          Cancel
        </StandardButton>
        )}
      </Panel>
    </Panel>
  );
}

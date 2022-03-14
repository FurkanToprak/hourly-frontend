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

const localizer = momentLocalizer(moment);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

const inputStyle: React.CSSProperties = {
  margin: 10,
};

const fullRowStyle = { width: '100%', display: 'flex', marginBottom: 10 };

export default function DashboardCalendar() {
  const [selectedEvent, setSelectedEvent] = useState(null as null | Event);
  const [eventTitle, setEventTitle] = useState('');
  const [startDate, setStartDate] = useState(null as null | Date);
  const [endDate, setEndDate] = useState(null as null | Date);
  const [events, setEvents] = useState([
    {
      title: 'example Event',
      start: moment().toDate(),
      end: moment().add(1, 'day').toDate(),
    },
  ] as Event[]);
  const eventReady = eventTitle !== '' && startDate !== null && endDate !== null;
  return (
    <Panel centerY flex="column" fill>
      {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
       * @ts-ignore */}
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        onEventDrop={(droppedEvent) => {
          const oldEvent = droppedEvent.event as Event;
          const freshEvents = events.filter((value) => value !== oldEvent);
          freshEvents.push({
            start: new Date(droppedEvent.start),
            end: new Date(droppedEvent.end),
            title: oldEvent.title,
          });
          setEvents(freshEvents);
        }}
        onEventResize={(resizedEvent) => {
          const oldEvent = resizedEvent.event as Event;
          const freshEvents = events.filter((value) => value !== oldEvent);
          freshEvents.push({
            start: new Date(resizedEvent.start),
            end: new Date(resizedEvent.end),
            title: oldEvent.title,
          });
          setEvents(freshEvents);
        }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        resizable
        style={{ margin: 10 }}
      />
      <Panel centerY flex="column" margin>
        <StandardInput
          label="Title"
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
            const freshEvents = events;
            freshEvents.push({
              start: startDate as Date,
              end: endDate as Date,
              title: eventTitle,
            });
            setEvents(freshEvents);
          }}
        >
          Create Event
        </StandardButton>
      </Panel>
    </Panel>
  );
}

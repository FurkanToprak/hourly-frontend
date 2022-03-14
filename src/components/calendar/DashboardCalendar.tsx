import React, { useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import Panel from '../utils/Panel';
import '../../styles/DashboardCalendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const localizer = momentLocalizer(moment);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

export default function DashboardCalendar() {
  const [events, setEvents] = useState([
    {
      title: 'example Event',
      start: moment().toDate(),
      end: moment().add(1, 'day').toDate(),
    },
  ] as Event[]);
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
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        resizable
        style={{ margin: 10 }}
      />
    </Panel>
  );
}

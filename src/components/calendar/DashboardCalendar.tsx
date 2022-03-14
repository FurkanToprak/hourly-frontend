import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Panel from '../utils/Panel';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const containerStyle: React.CSSProperties = {
  flex: 1,
};
export default function DashboardCalendar() {
  return (
    <Panel centerY flex="column" fill>
      <Calendar
        localizer={localizer}
        events={[]}
        startAccessor="start"
        endAccessor="end"
      />
    </Panel>
  );
}

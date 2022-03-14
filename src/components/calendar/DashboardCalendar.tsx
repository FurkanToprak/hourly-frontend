import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
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
  return (
    <Panel centerY flex="column" fill>
      {/** eslint-disable-next-line @typescript-eslint/ban-ts-comment
       * @ts-ignore */}
      <DnDCalendar
        defaultDate={moment().toDate()}
        defaultView="month"
        onEventDrop={() => {
          //
        }}
        onEventResize={() => {
          //
        }}
        localizer={localizer}
        events={[
          {
            start: moment().toDate(),
            end: moment().add(1, 'days').toDate(),
            title: 'Furkan eats booty',
          },
        ]}
        startAccessor="start"
        endAccessor="end"
        resizable
        style={{ margin: 10 }}
      />
    </Panel>
  );
}

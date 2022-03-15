import React from 'react';
import DashboardCalendar from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Title } from '../components/utils/Texts';

export default function Dashboard() {
  return (
    <Page fullHeight centerY>
      <Title>Dashboard</Title>
      <DashboardCalendar />
    </Page>
  );
}

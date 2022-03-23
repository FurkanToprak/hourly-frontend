import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import { Navigate } from 'react-router-dom';
import DashboardCalendar from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import { black, white } from '../styles/Theme';
import Modal from '../components/utils/Modal';
import { StandardButton } from '../components/utils/Buttons';
import TimeSelect from '../components/calendar/TimeSelect';
import { useAuth } from '../contexts/Auth';

export default function Dashboard() {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" />;
  }
  const [startTime, setStartTime] = useState(user.startOfDay);
  const [endTime, setEndTime] = useState(user.endOfDay);
  return (
    <Page fullHeight centerY>
      <Modal open={openCalendarModal} onClose={() => { setOpenCalendarModal(false); }}>
        <Title size="l">Import Calendar</Title>
        <StandardButton variant="outlined">Connect Google Calendar</StandardButton>
      </Modal>
      <Modal open={openSettingsModal} onClose={() => { setOpenSettingsModal(false); }}>
        <Title size="l">Settings</Title>
        <div style={{
          marginTop: 10, width: '100%', display: 'flex', justifyContent: 'space-between',
        }}
        >
          <TimeSelect default={startTime} showTimeSelectOnly label="Do not work before" onTimeChange={(newTime) => { setStartTime(newTime); }} />
          <div style={{ width: 20 }} />
          <TimeSelect default={endTime} showTimeSelectOnly label="Do not work after" onTimeChange={(newTime) => { setEndTime(newTime); }} />
          <StandardButton style={{ marginLeft: 10 }} variant="outlined">
            <WorkOffIcon
              fontSize="large"
              style={{
                cursor: 'pointer', color: themeFont,
              }}
            />
          </StandardButton>
        </div>
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
        <StandardButton variant="outlined">Tasks</StandardButton>
        <DownloadIcon
          fontSize="large"
          style={{ cursor: 'pointer', color: themeFont }}
          onMouseDown={() => {
            // Google Calendar Import
            setOpenCalendarModal(true);
          }}
        />
      </div>
      <DashboardCalendar />
    </Page>
  );
}

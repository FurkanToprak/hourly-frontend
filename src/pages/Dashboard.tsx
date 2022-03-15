import React from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DashboardCalendar from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import { black, white } from '../styles/Theme';

export default function Dashboard() {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  return (
    <Page fullHeight centerY>
      <Title>Dashboard</Title>
      <div style={{
        width: '100%', display: 'flex', justifyContent: 'right', marginRight: 30,
      }}
      >
        <DownloadIcon
          fontSize="large"
          style={{ cursor: 'pointer', color: themeFont }}
          onMouseDown={() => {
            // Google Calendar Import
          }}
        />
      </div>
      <DashboardCalendar />
    </Page>
  );
}

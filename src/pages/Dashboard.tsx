import React, { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import DashboardCalendar from '../components/calendar/DashboardCalendar';
import Page from '../components/utils/Page';
import { Title } from '../components/utils/Texts';
import { useTheme } from '../contexts/Theme';
import { black, white } from '../styles/Theme';
import Modal from '../components/utils/Modal';
import { StandardButton } from '../components/utils/Buttons';

export default function Dashboard() {
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [openModal, setOpenModal] = useState(false);
  return (
    <Page fullHeight centerY>
      <Modal open={openModal} onClose={() => { setOpenModal(false); }}>
        <Title size="l">Import Calendar</Title>
        <StandardButton variant="outlined">Connect Google Calendar</StandardButton>
      </Modal>
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
            setOpenModal(true);
          }}
        />
      </div>
      <DashboardCalendar />
    </Page>
  );
}

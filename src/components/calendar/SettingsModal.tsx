import React, { useState, useEffect } from 'react';
import WorkOffIcon from '@mui/icons-material/WorkOff';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Body, Title } from '../utils/Texts';
import Modal from '../utils/Modal';
import TimeSelect from './TimeSelect';
import { RaspberryButton, StandardButton } from '../utils/Buttons';
import { useAuth } from '../../contexts/Auth';
import { useTheme } from '../../contexts/Theme';
import { black, white } from '../../styles/Theme';
import FlaskClient from '../../connections/Flask';

export default function SettingsModal(props: {
    open: boolean;
    onClose: () => void;
}) {
  const { user } = useAuth();
  if (!user) {
    return <div />;
  }
  const navigate = useNavigate();
  const { theme } = useTheme();
  const themeFont = theme === 'light' ? black : white;
  const [startTime, setStartTime] = useState(moment().toDate());
  const [endTime, setEndTime] = useState(moment().toDate());
  const experimental = true;
  const [fetchedTimeAlready, setFetchedTimeAlready] = useState(false);
  const postTimes = async () => {
    await FlaskClient.post('users/updateSleep', { user_id: user.id, startOfDay: startTime, endOfDay: endTime });
  };
  const fetchTimes = async () => {
    if (fetchedTimeAlready) {
      return;
    }
    const fetchedTime: { endOfDay: string; startOfDay: string;} = await FlaskClient.post('users/getSleep', { user_id: user.id });
    const fetchedStart = moment(fetchedTime.startOfDay).toDate();
    const fetchedEnd = moment(fetchedTime.endOfDay).toDate();
    setStartTime(fetchedStart);
    setEndTime(fetchedEnd);
    setFetchedTimeAlready(true);
  };
  const deleteEverything = async () => {
    await FlaskClient.post('users/deleteForUser', { user_id: user.id });
    navigate('/');
  };
  useEffect(() => {
    fetchTimes();
  }, [startTime, endTime]);
  return (
    <Modal open={props.open} onClose={() => { props.onClose(); }}>
      <Title size="l">Settings</Title>
      <div style={{
        marginTop: 10, width: '100%', display: 'flex', justifyContent: 'space-between',
      }}
      >
        <TimeSelect default={startTime} showTimeSelectOnly label="Do not work before" onTimeChange={(newTime) => { setStartTime(newTime); }} />
        <div style={{ width: 20 }} />
        <TimeSelect default={endTime} showTimeSelectOnly label="Do not work after" onTimeChange={(newTime) => { setEndTime(newTime); }} />
        <StandardButton
          style={{ marginLeft: 10 }}
          variant="outlined"
          onMouseDown={() => {
            postTimes();
          }}
        >
          <WorkOffIcon
            fontSize="large"
            style={{
              cursor: 'pointer', color: themeFont,
            }}
          />
        </StandardButton>
      </div>
      { experimental && (
      <RaspberryButton
        style={{ marginTop: 10 }}
        onMouseDown={deleteEverything}
        fullWidth
        variant="outlined"
      >
        Reset Account
      </RaspberryButton>
      )}
    </Modal>
  );
}

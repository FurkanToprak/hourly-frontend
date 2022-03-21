import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PurpleButton, RaspberryButton } from '../components/utils/Buttons';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import { useAuth } from '../contexts/Auth';

export default function Home() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  return (
    <Page>
      <Panel centerY flex="column">
        <Title size="xl" color="raspberry">Hourly</Title>
        <Body size="m">A feature-rich planner that automates your tasks.</Body>
      </Panel>
      <Panel centerY flex="column">
        <Title size="l" color="purple">Automate the tedious</Title>
        <Body size="m">Automatically schedule tasks in your free time.</Body>
        <Body size="m">Reschedule missed tasks in one click.</Body>
      </Panel>
      <Panel centerY flex="column">
        <Title size="l" color="purple">Join communities</Title>
        <Body size="m">Compare schedules and productivity with your peers.</Body>
        <Body size="m">Schedule meetings with friends in just one click.</Body>
      </Panel>
      <Panel centerY flex="column">
        <Title size="l" color="purple">Goodbye, other apps!</Title>
        <Body size="m">Import your Google Calendar.</Body>
        <Body size="m">Convenient social scheduling in a single click.</Body>
        <Body size="m">Your to-do list&apos;s new home.</Body>
      </Panel>
      <Panel centerY flex="column">
        <div style={{
          margin: 10, display: 'flex', width: '50%', flexDirection: 'column',
        }}
        >
          {
            isLoggedIn ? (
              <PurpleButton
                onMouseDown={() => {
                  navigate('/dashboard');
                }}
                fullWidth
                variant="outlined"
              >
                Get started
              </PurpleButton>
            )
              : (
                <>
                  <RaspberryButton
                    onMouseDown={() => {
                      navigate('/signup');
                    }}
                    fullWidth
                    variant="outlined"
                  >
                    Sign Up

                  </RaspberryButton>
                  <div style={{ height: 10 }} />
                  <PurpleButton
                    onMouseDown={() => {
                      navigate('/login');
                    }}
                    fullWidth
                    variant="outlined"
                  >
                    Log In

                  </PurpleButton>
                </>
              )
          }

        </div>
      </Panel>
    </Page>
  );
}

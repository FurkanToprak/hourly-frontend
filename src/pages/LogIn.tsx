import React from 'react';
import GoogleOAuth from '../components/auth/GoogleOAuth';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';

export default function LogIn() {
  return (
    <Page centerY fullHeight>
      <Title>Log In</Title>
      <Panel centerX centerY>
        <GoogleOAuth type="Log In" />
      </Panel>
    </Page>
  );
}

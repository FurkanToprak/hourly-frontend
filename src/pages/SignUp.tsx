import React from 'react';
import GoogleOAuth from '../components/auth/GoogleOAuth';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';

export default function SignUp() {
  return (
    <Page centerY>
      <Title>Sign Up</Title>
      <Panel centerX centerY flex="row">
        <GoogleOAuth type="Sign Up" />
      </Panel>
    </Page>
  );
}

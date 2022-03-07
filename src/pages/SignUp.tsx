import React from 'react';
import { StandardInput } from '../components/utils/Inputs';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Title } from '../components/utils/Texts';

export default function SignUp() {
  return (
    <Page centerY>
      <Title>Sign Up</Title>
      <Panel centerX centerY>
        {/* <Body>sign in with Google</Body> */}
      </Panel>
    </Page>
  );
}

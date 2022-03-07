import React from 'react';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';

export default function SignUp() {
  return (
    <Page centerY>
      <Title>Sign Up</Title>
      <Panel centerX centerY>
        <Body>Trial</Body>
      </Panel>
    </Page>
  );
}

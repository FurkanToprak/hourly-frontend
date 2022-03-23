import React from 'react';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';

export default function Groups() {
  return (
    <Page centerY fullHeight>
      <Panel fill flex="column" centerY>
        <Title>MATH 411</Title>
        <Body>A group for MATH 411.</Body>
      </Panel>
    </Page>
  );
}

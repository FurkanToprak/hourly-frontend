import { group } from 'console';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RaspberryButton } from '../components/utils/Buttons';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import { Group } from './Groups';

export default function Group() {
  const groupParams = useParams();
  const groupId = groupParams.groupid || '';
  const [thisGroup, setThisGroup] = useState(null as null | false | Group);
  useEffect(() => {
    if (thisGroup !== null) {
      return;
    }
    setThisGroup(false);
  }, [thisGroup]);
  if (thisGroup === null || thisGroup === false) {
    return <div />;
  }
  return (
    <Page centerY fullHeight>
      <Panel fill flex="column" centerY>
        <Title>MATH 411</Title>
        <Body>A group for MATH 411.</Body>
        <RaspberryButton>Leave Group</RaspberryButton>
      </Panel>
    </Page>
  );
}

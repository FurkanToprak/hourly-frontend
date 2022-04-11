import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RaspberryButton } from '../components/utils/Buttons';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { useAuth } from '../contexts/Auth';
import { Group } from './Groups';

export default function GroupPage() {
  const navigate = useNavigate();
  const groupParams = useParams();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupId = groupParams.groupid || '';
  const [thisGroup, setThisGroup] = useState(null as null | false | Group);
  const leaveGroup = async () => {
    if (user === null || thisGroup === null || thisGroup === false) {
      return;
    }
    const leaveResponse = await FlaskClient.post('groups/leaveGroup', {
      user_id: user.id,
      group_id: thisGroup.id,
    });
    if (leaveResponse.success === false) {
      // TODO:
    }
    navigate('/groups');
  };
  useEffect(() => {
    if (thisGroup !== null) {
      return;
    }
    // TODO: fetch group with group ID
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
        <RaspberryButton onMouseDown={() => {
          leaveGroup();
        }}
        >
          Leave Group

        </RaspberryButton>
      </Panel>
    </Page>
  );
}

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import { RaspberryButton } from '../components/utils/Buttons';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { useAuth } from '../contexts/Auth';
import { purple, raspberry } from '../styles/Theme';
import { Group } from './Groups';

interface StatsSchema {
  completed_hours_list: number[];
  estimated_hours_list: number[];
  num_completed_tasks: number;
  num_incompleted_tasks: number;
  total_week_hours: number[];
}
export default function GroupPage() {
  const navigate = useNavigate();
  const groupParams = useParams();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupId = groupParams.groupid || '';
  const [thisGroup, setThisGroup] = useState(null as null | false | Group);
  const [groupStats, setGroupStats] = useState(null as null | StatsSchema);
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
  const fetchGroup = async () => {
    if (thisGroup !== null) {
      return;
    }
    const fetchedStats: StatsSchema = await FlaskClient.post('groups/getStats', {
      group_id: groupId,
    });

    setGroupStats(fetchedStats);
    // TODO: fetch group with group ID
    setThisGroup(false);
  };
  useEffect(() => {
    fetchGroup();
  }, [thisGroup]);
  if (thisGroup === null || thisGroup === false) {
    return <div />;
  }
  return (
    <Page centerY fullHeight>
      <Panel fill flex="column" centerY>
        <Title>{thisGroup.name}</Title>
        <Body>{thisGroup.description}</Body>
        {
          groupStats && (
          <>
            <Body>{`Total work hours this week: ${groupStats.total_week_hours}`}</Body>
            <Pie
              title=""
              data={[{
                id: 'num_incompleted_tasks',
                label: 'Incompleted Tasks',
                value: groupStats.num_incompleted_tasks,
                color: purple,
              }, {
                id: 'num_completed_tasks',
                label: 'Completed Tasks',
                value: groupStats.num_completed_tasks,
                color: raspberry,
              }]}
            />
            <Histogram title="Completed Time" data={groupStats.completed_hours_list} color={raspberry} />
            <Histogram title="Estimated Time" data={groupStats.estimated_hours_list} color={purple} />
          </>
          )
        }
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

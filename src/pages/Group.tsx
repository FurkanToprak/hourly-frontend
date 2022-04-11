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
  console.log(groupStats);
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
    const fetchedGroup: { group: Group} = await FlaskClient.post('groups/getGroupInfo', {
      group_id: groupId,
    });
    const fetchedStats: StatsSchema = await FlaskClient.post('groups/getStats', {
      group_id: groupId,
    });

    setGroupStats(fetchedStats);
    // TODO: fetch group with group ID
    setThisGroup(fetchedGroup.group);
  };
  useEffect(() => {
    fetchGroup();
  }, [thisGroup]);
  if (thisGroup === null || thisGroup === false) {
    return <div />;
  }
  return (
    <Page centerY fullHeight>
      <Panel fill flex="column" centerY margin>
        <Title>{thisGroup.name}</Title>
        <Title size="s">{thisGroup.description}</Title>
        {
          groupStats && (
          <>
            <Body>{`Your group will work ${groupStats.total_week_hours} hours this week.`}</Body>
            <div style={{ height: 30 }} />
            <div style={{ width: '100%', height: 200, display: 'flex' }}>
              <Pie
                title="Completed Tasks"
                data={[{
                  id: '# of Incompleted Tasks',
                  label: '# of Incompleted Tasks',
                  value: groupStats.num_incompleted_tasks,
                  color: purple,
                }, {
                  id: '# of Completed Tasks',
                  label: '# of Completed Tasks',
                  value: groupStats.num_completed_tasks,
                  color: raspberry,
                }]}
              />
            </div>
            <div style={{ width: '100%', height: 300, display: 'flex' }}><Histogram title="Completed Time" data={groupStats.completed_hours_list} color={raspberry} /></div>
            <div style={{ width: '100%', height: 300, display: 'flex' }}><Histogram title="Estimated Time" data={groupStats.estimated_hours_list} color={purple} /></div>
          </>
          )
        }
        <RaspberryButton
          fullWidth
          variant="outlined"
          onMouseDown={() => {
            leaveGroup();
          }}
        >
          Leave Group
        </RaspberryButton>
      </Panel>
    </Page>
  );
}

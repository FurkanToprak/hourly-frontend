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
import { useTheme } from '../contexts/Theme';
import {
  purple, raspberry, thinDarkBorder, thinLightBorder,
} from '../styles/Theme';
import { Group } from './Groups';

interface StatsSchema {
  completed_hours_list: number[];
  estimated_hours_list: number[];
  num_completed_tasks: number;
  num_incompleted_tasks: number;
  total_week_hours: number[];
}

type MemberSchema = [string, string]; // id , name

export default function GroupPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const themeBorder = theme === 'light' ? thinLightBorder : thinDarkBorder;
  const groupParams = useParams();
  const { user } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groupId = groupParams.groupid || '';
  const [thisGroup, setThisGroup] = useState(null as null | false | Group);
  const [groupStats, setGroupStats] = useState(null as null | StatsSchema);
  const [groupMembers, setGroupMembers] = useState(null as null | string[]);
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
    if (thisGroup !== null || user === null) {
      return;
    }
    const fetchedGroup: { group: Group} = await FlaskClient.post('groups/getGroupInfo', {
      group_id: groupId,
    });
    const fetchedStats: StatsSchema = await FlaskClient.post('groups/getStats', {
      group_id: groupId,
    });
    const fetchedMembers: {
      awaiting_their_response: MemberSchema[];
      awaiting_your_response: MemberSchema[];
      mutual: MemberSchema[];
      no_relation: MemberSchema[];
     } = await FlaskClient.post('groups/getFriendsList', {
       group_id: groupId,
       user_id: user.id,
     });
    console.log('fetchedMembers');
    console.log(fetchedMembers);
    setGroupMembers([]); // TODO:
    setGroupStats(fetchedStats);
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
      <Panel flex="column" centerY margin>
        <Title>{thisGroup.name}</Title>
        <Title size="s">{thisGroup.description}</Title>
        {
          groupStats && (
          <>
            <Body>{`Your group will work ${groupStats.total_week_hours} hours this week.`}</Body>
            <div style={{ height: 30 }} />
            <div style={{ width: '100%', height: 250, display: 'flex' }}>
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
      <Panel centerY flex="column">
        <Title size="m">Group Members</Title>
        {(groupMembers || []).map((value) => (
          <div
            style={{
              borderTop: themeBorder,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingTop: 4,
              paddingBottom: 4,
            }}
          >
            <Body>{value}</Body>
          </div>
        ))}
      </Panel>
    </Page>
  );
}

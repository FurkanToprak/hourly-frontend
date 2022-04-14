import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import { RaspberryButton, StandardButton } from '../components/utils/Buttons';
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

interface GroupSchema {
  awaiting_their_response: MemberSchema[];
  awaiting_your_response: MemberSchema[];
  mutual: MemberSchema[];
  no_relation: MemberSchema[];
 }

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
  const [groupMembers, setGroupMembers] = useState(null as null | GroupSchema);
  const [highlightedMember, setHightlightedMember] = useState(null as null | string);
  const addFriend = async (memberId: string) => {
    if (user === null || !thisGroup) {
      return;
    }
    const addFriendResponse = await FlaskClient.post('groups/addFriend', {
      user_id_1: user.id,
      user_id_2: memberId,
      group_id: thisGroup.id,
    });
    console.log('addFriendResponse');
    console.log(addFriendResponse);
    setGroupMembers(null);
  };
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
    const fetchedMembers: GroupSchema = await FlaskClient.post('groups/getFriendsList', {
      group_id: groupId,
      user_id: user.id,
    });
    setGroupMembers(fetchedMembers);
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
        <div style={{ width: '100%', paddingLeft: 10 }}>
          <Title size="s">Friends</Title>
        </div>
        {(groupMembers?.mutual === undefined || groupMembers?.mutual.length > 0)
          ? groupMembers?.mutual.map((groupMember) => {
            const thisHighlighted = groupMember[0] === highlightedMember;
            return (
              <div
                onMouseOver={() => {
                  setHightlightedMember(groupMember[0]);
                }}
                onMouseLeave={() => {
                  setHightlightedMember(null);
                }}
                onFocus={() => { //
                }}
                key={`mutual-member-${groupMember[0]}`}
                style={{
                  borderBottom: themeBorder,
                  backgroundColor: thisHighlighted ? purple : undefined,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Body>{groupMember[1]}</Body>
              </div>
            );
          }) : <div style={{ width: '100%', paddingLeft: 10, height: 40 }}><Body>No friends yet :(</Body></div>}
        <div style={{ width: '100%', paddingLeft: 10 }}>
          <Title size="s">Pending Friend Requests</Title>
        </div>
        {(groupMembers?.awaiting_your_response === undefined
        || groupMembers?.awaiting_your_response.length > 0)
          ? groupMembers?.awaiting_your_response.map((groupMember) => {
            const thisHighlighted = groupMember[0] === highlightedMember;
            return (
              <div
                onFocus={() => { //
                }}
                onMouseOver={() => {
                  setHightlightedMember(groupMember[0]);
                }}
                onMouseLeave={() => {
                  setHightlightedMember(null);
                }}
                key={`pending-member-${groupMember[0]}`}
                style={{
                  borderBottom: themeBorder,
                  backgroundColor: thisHighlighted ? purple : undefined,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: thisHighlighted ? 'space-between' : undefined,
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Body>{groupMember[1]}</Body>
                { thisHighlighted && (
                <StandardButton
                  variant="outlined"
                  onMouseDown={() => {
                    addFriend(groupMember[0]);
                  }}
                >
                  +
                </StandardButton>
                )}
              </div>
            );
          }) : <div style={{ width: '100%', paddingLeft: 10, height: 40 }}><Body>No pending friends.</Body></div>}
        <div style={{ width: '100%', paddingLeft: 10 }}>
          <Title size="s">Sent Friend Requests</Title>
        </div>

        {(groupMembers?.awaiting_their_response === undefined
        || groupMembers?.awaiting_their_response.length > 0)
          ? groupMembers?.awaiting_their_response.map((groupMember) => {
            const thisHighlighted = groupMember[0] === highlightedMember;
            return (
              <div
                onFocus={() => { //
                }}
                onMouseOver={() => {
                  setHightlightedMember(groupMember[0]);
                }}
                onMouseLeave={() => {
                  setHightlightedMember(null);
                }}
                key={`sent-member-${groupMember[0]}`}
                style={{
                  borderBottom: themeBorder,
                  backgroundColor: thisHighlighted ? purple : undefined,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Body>{groupMember[1]}</Body>
              </div>
            );
          }) : <div style={{ width: '100%', paddingLeft: 10, height: 40 }}><Body>No sent friends.</Body></div>}

        <div style={{ width: '100%', paddingLeft: 10 }}>
          <Title size="s">Other Members</Title>
        </div>
        {(groupMembers?.no_relation === undefined
        || groupMembers?.no_relation.length > 0)
          ? groupMembers?.no_relation.map((groupMember) => {
            const thisHighlighted = groupMember[0] === highlightedMember;
            return (
              <div
                onMouseOver={() => {
                  setHightlightedMember(groupMember[0]);
                }}
                onMouseLeave={() => {
                  setHightlightedMember(null);
                }}
                onFocus={() => { //
                }}
                key={`other-member-${groupMember[0]}`}
                style={{
                  borderBottom: themeBorder,
                  backgroundColor: thisHighlighted ? purple : undefined,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: thisHighlighted ? 'space-between' : undefined,
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Body>{groupMember[1]}</Body>
                { thisHighlighted && (
                <StandardButton
                  variant="outlined"
                  onMouseDown={() => {
                    addFriend(groupMember[0]);
                  }}
                >
                  +
                </StandardButton>
                )}
              </div>
            );
          }) : <div style={{ width: '100%', paddingLeft: 10, height: 40 }}><Body>Everyone is your friend!</Body></div>}

      </Panel>
    </Page>
  );
}

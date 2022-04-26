import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Histogram from '../components/graphs/Histogram';
import Pie from '../components/graphs/Pie';
import { RaspberryButton, StandardButton } from '../components/utils/Buttons';
import Modal from '../components/utils/Modal';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { useAuth } from '../contexts/Auth';
import { useTheme } from '../contexts/Theme';
import {
  purple, raspberry, thinDarkBorder, thinLightBorder, lightPurple,
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
  const [collabMessage, setCollabMessage] = useState('');
  const [thisGroup, setThisGroup] = useState(null as null | false | Group);
  const [groupStats, setGroupStats] = useState(null as null | StatsSchema);
  const [groupMembers, setGroupMembers] = useState(null as null | GroupSchema);
  const [highlightedMember, setHightlightedMember] = useState(null as null | string);
  const [copyClipboardText, setCopyClipboardText] = useState('copy invite code');
  const addFriend = async (memberId: string) => {
    if (user === null || !thisGroup) {
      return;
    }
    await FlaskClient.post('groups/addFriend', {
      user_id_1: user.id,
      user_id_2: memberId,
      group_id: thisGroup.id,
    });
    setGroupMembers(null);
  };
  const removeFriend = async (memberId: string) => {
    if (user === null || !thisGroup) {
      return;
    }
    await FlaskClient.post('groups/removeFriend', {
      user_id_1: user.id,
      user_id_2: memberId,
      group_id: thisGroup.id,
    });
    setGroupMembers(null);
  };
  const collaborateFriend = async (collabWith: MemberSchema) => {
    if (user === null || !thisGroup || groupMembers === null) {
      return;
    }
    const collaborateResponse: { end_time: string; name: string; start_time: string; success: boolean } = await FlaskClient.post('groups/checkCollaborators', {
      user_id_1: user.id,
      name_1: user.name,
      user_id_2: collabWith[0],
      name_2: collabWith[1],
      group_id: thisGroup.id,
    });
    if (collaborateResponse.success) {
      await FlaskClient.post('schedule', {
        user_id: user.id,
      });
      const rawStartTime = new Date(collaborateResponse.start_time);
      const startTime = moment(rawStartTime);
      const endTime = moment(new Date(collaborateResponse.end_time));
      const collabDay = startTime.date();
      const collabMonth = rawStartTime.toLocaleString('default', { month: 'long' });
      const collabYear = startTime.year();
      const startMeetingTime = `${startTime.hour()}:${startTime.minutes() || '00'}`;
      const endMeetingTime = `${endTime.hour()}:${endTime.minutes() || '00'}`;
      setCollabMessage(`Scheduled a meeting with ${collaborateResponse.name} from ${startMeetingTime} to ${endMeetingTime} on ${collabDay} ${collabMonth} ${collabYear}. We sent you and your collaborator an email with more details.`);
    } else {
      setCollabMessage('We could not find a meeting time that works for both of you.');
    }
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
    setGroupStats(fetchedStats);
    setThisGroup(fetchedGroup.group);
  };
  const fetchGroupMembers = async () => {
    if (thisGroup === null || user === null || groupMembers !== null) {
      return;
    }
    const fetchedMembers: GroupSchema = await FlaskClient.post('groups/getFriendsList', {
      group_id: groupId,
      user_id: user.id,
    });
    setGroupMembers(fetchedMembers);
  };
  const copyGroupIdToClipboard = async () => {
    //
    if (!thisGroup) {
      return;
    }
    navigator.clipboard.writeText(thisGroup.id);
    setCopyClipboardText('copied!');
    // eslint-disable-next-line no-promise-executor-return
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    await sleep(1000);
    setCopyClipboardText('copy invite code');
  };
  useEffect(() => {
    fetchGroup();
  }, [thisGroup]);
  useEffect(() => {
    fetchGroupMembers();
  }, [groupMembers, thisGroup]);
  if (thisGroup === null || thisGroup === false) {
    return <div />;
  }
  return (
    <Page centerY fullHeight>
      <Modal
        open={collabMessage !== ''}
        onClose={() => {
          setCollabMessage('');
        }}
      >
        <Title size="m">Collaboration Details</Title>
        <Body>{collabMessage}</Body>
      </Modal>
      <Panel flex="column" centerY margin>
        <Title>{thisGroup.name}</Title>
        <Title size="s">{thisGroup.description}</Title>
        <StandardButton
          style={{
            width: 200,
          }}
          variant="outlined"
          onMouseDown={() => {
            copyGroupIdToClipboard();
          }}
        >
          {copyClipboardText}

        </StandardButton>
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
                  backgroundColor: thisHighlighted ? lightPurple : undefined,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: thisHighlighted ? 'space-between' : undefined,
                  alignItems: 'center',
                  paddingTop: 4,
                  paddingBottom: 4,
                  height: 40,
                }}
              >
                <Body>{groupMember[1]}</Body>
                { thisHighlighted && (
                <div>
                  <StandardButton
                    variant="outlined"
                    onMouseDown={() => {
                      removeFriend(groupMember[0]);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    x
                  </StandardButton>
                  <StandardButton
                    variant="outlined"
                    onMouseDown={() => {
                      collaborateFriend(groupMember);
                    }}
                  >
                    Collaborate
                  </StandardButton>
                </div>
                )}
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
                  backgroundColor: thisHighlighted ? lightPurple : undefined,
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
                  <div>
                    <StandardButton
                      variant="outlined"
                      onMouseDown={() => {
                        removeFriend(groupMember[0]);
                      }}
                      style={{ marginRight: 10 }}
                    >
                      x
                    </StandardButton>
                    <StandardButton
                      variant="outlined"
                      onMouseDown={() => {
                        addFriend(groupMember[0]);
                      }}
                    >
                      +
                    </StandardButton>
                  </div>
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
                  backgroundColor: thisHighlighted ? lightPurple : undefined,
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
                    removeFriend(groupMember[0]);
                  }}
                  style={{ marginRight: 10 }}
                >
                  x
                </StandardButton>
                )}
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
                  backgroundColor: thisHighlighted ? lightPurple : undefined,
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

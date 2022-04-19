import { group } from 'console';
import React, { useEffect, useState } from 'react';
import { PurpleButton, RaspberryButton } from '../components/utils/Buttons';
import { StandardInput } from '../components/utils/Inputs';
import Modal from '../components/utils/Modal';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import Table from '../components/utils/Table';
import { Body, Title } from '../components/utils/Texts';
import FlaskClient from '../connections/Flask';
import { useAuth } from '../contexts/Auth';

export interface Group {
  id: string;
  name: string;
  description: string;
  user_id: string;
}

export default function Groups() {
  const { user } = useAuth();
  const [groupError, setGroupError] = useState(undefined as undefined | string);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState(null as null | Group[]);
  const validCreateForm = name.length > 0 && description.length > 0;
  const validJoinForm = groupId.length > 0;
  const [joinError, setJoinError] = useState('');
  const fetchGroups = async () => {
    if (user === null || groups !== null) {
      return;
    }
    const postResult: { groups: Group[] } = await FlaskClient.post('groups/getUsersGroups', {
      user_id: user.id,
    });
    setGroups(postResult.groups);
  };
  const postGroup = async () => {
    if (name.length === 0 || description.length === 0 || user === null) {
      return;
    }
    const newGroup: Group = {
      id: '',
      name,
      description,
      user_id: user.id,
    };
    const postResult: { success: boolean } = await FlaskClient.post('groups/createGroup', newGroup);
    if (postResult.success === false) {
      setGroupError('Could not join group. Make sure the group ID is correct.');
      return;
    }
    setGroups(null);
    setCreateModalOpen(false);
  };
  const joinGroup = async () => {
    if (user === null) {
      return;
    }
    const joinGroupResponse: { success: boolean } = await FlaskClient.post('groups/joinGroup', {
      user_id: user.id,
      group_id: groupId,
    });
    if (joinGroupResponse.success) {
      setJoinError('');
      setJoinModalOpen(false);
    } else {
      setJoinError('No such group exists.');
    }
    setGroups(null);
  };
  useEffect(() => {
    fetchGroups();
  }, [groups]);
  if (user === null) {
    return <div />;
  }
  return (
    <Page centerY fullHeight>
      <Modal
        open={groupError !== undefined}
        onClose={() => {
          setGroupError(undefined);
        }}
      >
        <Title size="m">Oops!</Title>
        <Body>{groupError || ''}</Body>
      </Modal>
      <Modal
        open={joinModalOpen}
        onClose={() => {
          setJoinModalOpen(false);
          setGroupId('');
        }}
      >
        <Title size="m">Join Group</Title>
        <StandardInput fullWidth label="Group ID" onChange={(e) => { setGroupId(e.target.value); }} />
        <PurpleButton
          onMouseDown={() => {
            joinGroup();
          }}
          style={{ marginTop: 10 }}
          fullWidth
          disabled={!validJoinForm}
          variant="outlined"
        >
          {joinError || 'Join'}
        </PurpleButton>
      </Modal>
      <Modal
        open={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setName('');
          setDescription('');
        }}
      >
        <Title size="m">Create Group</Title>
        <StandardInput fullWidth label="Group name" onChange={(e) => { setName(e.target.value); }} />
        <StandardInput style={{ marginTop: 10, marginBottom: 10 }} fullWidth label="Group description" onChange={(e) => { setDescription(e.target.value); }} />
        <RaspberryButton
          onMouseDown={() => {
            postGroup();
          }}
          fullWidth
          disabled={!validCreateForm}
          variant="outlined"
        >
          Create
        </RaspberryButton>
      </Modal>
      <Title>Groups</Title>
      <Panel flex="column" fill>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: 10 }}>
          <PurpleButton onMouseDown={() => { setJoinModalOpen(true); }} variant="outlined" style={{ flex: 1 }}>
            Join
          </PurpleButton>
          <div style={{ flex: 1 }} />
          <RaspberryButton onMouseDown={() => { setCreateModalOpen(true); }} variant="outlined" style={{ flex: 1 }}>
            Create
          </RaspberryButton>
        </div>
        <Table
          urlPrefix="group"
          keys={['name', 'description']}
          columns={['Name', 'Description']}
          items={groups || []}
          emptyMessage="You're not a member of any groups. Join or create a group."
        />
      </Panel>
    </Page>
  );
}

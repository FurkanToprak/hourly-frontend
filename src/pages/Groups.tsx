import React, { useState } from 'react';
import { PurpleButton, RaspberryButton } from '../components/utils/Buttons';
import { StandardInput } from '../components/utils/Inputs';
import Modal from '../components/utils/Modal';
import Page from '../components/utils/Page';
import Panel from '../components/utils/Panel';
import Table from '../components/utils/Table';
import { Title } from '../components/utils/Texts';

export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
}

export default function Groups() {
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groups, setGroups] = useState([] as Group[]);
  const validCreateForm = name.length > 0 && description.length > 0;
  const validJoinForm = groupId.length > 0;
  return (
    <Page centerY fullHeight>
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
            const freshGroups = groups.slice();
            const newGroup: Group = {
              id: groupId, name: 'joined group', description: 'example of a joined group', members: [],
            };
            freshGroups.push(newGroup);
            setGroups(freshGroups);
            setJoinModalOpen(false);
          }}
          style={{ marginTop: 10 }}
          fullWidth
          disabled={!validJoinForm}
          variant="outlined"
        >
          Join
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
            const freshGroups = groups.slice();
            const newGroup: Group = {
              id: 'examplegroup', name, description, members: [],
            };
            freshGroups.push(newGroup);
            setGroups(freshGroups);
            setCreateModalOpen(false);
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
          items={groups}
          emptyMessage="You're not a member of any groups. Join or create a group."
        />
      </Panel>
    </Page>
  );
}

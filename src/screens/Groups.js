import './Groups.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAccount } from '../context/useAccount.js';
import { fetchGroupMembers } from './Group_page.js';
export default function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [iconStates, setIconStates] = useState([]);
  const navigate = useNavigate();
  const {account} = useAccount();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  //fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/groups/all');
        setGroups(response.data);
        const savedStates = JSON.parse(localStorage.getItem('iconStates')) || [];
        const initialIconStates = response.data.map((_, index) => savedStates[index] || false);
        setIconStates(initialIconStates);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };

    fetchGroups();
  }, []);

  //handle group creation
  const handleCreateGroup = async (e) => {
    e.preventDefault();

    const ownerEmail = account ? account.email : null;

    if (!ownerEmail) {
      alert('You must be logged in to create a group.');
      return;
    }

    if (groupName.trim() === '') {
      alert('Please enter a group name.');
      return;
    }
    console.log(ownerEmail)

    try {
      console.log('Sending request with data:', { owner_email: ownerEmail, group_name: groupName });
      const response = await axios.post('http://localhost:3001/groups/create', {
        owner_email: ownerEmail,
        group_name: groupName,
      });
      console.log('Received response:', response);

      setGroupName('');

      console.log("response data lisäyksen jälkeen",response.data);
      setGroups((prevGroups) => [...prevGroups, {...response.data, members: [ownerEmail]}]);

      setIconStates((prevStates) => [...prevStates, false]);
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  //handle group joining and icon state
  const handleClick = (index, e, group) => {
    handleIconClick(index, e);
    handleJoinGroup(group.id);
  };

  //handle joining a group
  const handleJoinGroup = async (groupId, owner_email) => {
    if (!account) {
      alert('Please log in to be able to join groups.');
      return;
  }
    const memberEmail = account?.email || localStorage.getItem('email');

    if (!memberEmail) {
      alert('You must be logged in to join a group.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/groups/${groupId}/join`, {
        group_id: groupId,
        member_email: memberEmail,
      });

      if (response.status === 200) {
        alert('Successfully joined the group!');
        await fetchGroupMembers(groupId, setMembers, setLoading, setRole, account, owner_email);
      } else {
        alert('Failed to join the group.');
      }
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  //handle icon click and state saving
  const handleIconClick = (index, e) => {
    e.stopPropagation();
    const updatedIconStates = [...iconStates];
    updatedIconStates[index] = !updatedIconStates[index];

    localStorage.setItem(`iconStates`, JSON.stringify(updatedIconStates));

    setIconStates(updatedIconStates);
  };

  const handleGroupClick = (group) => {
    console.log(group)
    navigate("/group_page", { state: { groupId: group.id, groupName: group.group_name, owner_email: group.owner_email } });
  };

  return (
    <Container>
      <div className="groups-container">
        <h6>
        Here you can create and join groups and invite your friends to join movies and showtime schedules!
        </h6>
        <Form onSubmit={handleCreateGroup}>
        <div className="d-flex align-items-center">
          <Form.Group controlId="groupInput" className="mb-0 me-2 flex-grow-1">
            <Form.Control type="text" placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleCreateGroup}>
            <i className="bi bi-plus-circle"></i> Create Group
          </Button>
        </div>
        </Form>
      </div>

      <div className="list-group">
        <h6>All current groups:</h6>
        {groups.map((group, index) => (
          <Button
            variant="primary" type="submit"
            className="d-flex align-items-center list-group-item"
            key={index}
            onClick={() => handleGroupClick(group)}
          >
            {group.group_name}
            <span
            variant="btn-primary" type="button" className="d-flex align-items-center ms-auto"
            onClick={(e) => handleClick(index, e, group)}
            >
              {iconStates[index] ? (
                <i className="bi bi-person-fill-check"></i>
              ) : (
                <i className="bi bi-person-fill-add"></i>
              )}
            </span>
          </Button>
        ))}
      </div>
    </Container>
  );
}
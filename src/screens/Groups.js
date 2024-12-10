import './Groups.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAccount } from '../context/useAccount.js';
export default function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [iconStates, setIconStates] = useState([]);
  const navigate = useNavigate();
  const {account} = useAccount();

  //fetch all groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('http://localhost:3001/groups/all');
        setGroups(response.data);
        setIconStates(Array(response.data.length).fill(false));
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
  const handleClick = (index, e, groupOwnerEmail) => {
    handleIconClick(index, e);
    handleJoinGroup(groupOwnerEmail);
  };

  //handle joining a group
  const handleJoinGroup = async (groupOwnerEmail) => {
    const memberEmail = localStorage.getItem('email');

    try {
      await axios.post('http://localhost:3001/groups/join', {
        group_owner_email: groupOwnerEmail,
        member_email: memberEmail,
      });
      alert('Successfully joined the group!');
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  const handleGroupClick = (group) => {
    console.log(group)
    navigate("/group_page", { state: { groupId: group.id, groupName: group.group_name, owner_email: group.owner_email } });
  };

  const handleIconClick = (index, e) => {
    e.stopPropagation();
    const updatedIconStates = [...iconStates];
    updatedIconStates[index] = !updatedIconStates[index];
    setIconStates(updatedIconStates);
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
            onClick={(e) => handleClick(index, e)}
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
import './Groups.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export default function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [iconStates, setIconStates] = useState([]);
  const navigate = useNavigate();

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

    const account = JSON.parse(sessionStorage.getItem('account'));
    const ownerEmail = account ? account.email : null;

    if (!ownerEmail) {
      alert('You must be logged in to create a group.');
      return;
    }

    if (groupName.trim() === '') {
      alert('Please enter a group name.');
      return;
    }

    try {
      console.log('Sending request with data:', { owner_email: ownerEmail, group_name: groupName });
      const response = await axios.post('http://localhost:3001/groups/create', {
        owner_email: ownerEmail,
        group_name: groupName,
      });
      console.log('Received response:', response);

      setGroupName('');

      setGroups((prevGroups) => [...prevGroups, response.data]);

      setIconStates((prevStates) => [...prevStates, false]);
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (groupOwnerEmail) => {
    const memberEmail = localStorage.getItem('email'); // Replace with your auth logic

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
    navigate("/group_page", { state: { groupName: group.group_name } });
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
            onClick={(e) => handleIconClick(index, e)}
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
import './Groups.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
export default function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [iconStates, setIconStates] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleGroupAdd = (e) => {
    e.preventDefault();
    if (groupName.trim() !== '') {
      setGroups([...groups, groupName]);
      setIconStates([...iconStates, false]);
      setGroupName('');
    }
  };

  const handleButtonClick = (group) => {
    navigate("/group_page", { state: { groupName: group } });
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
        <Form
          onSubmit={handleSubmit}
        >
        <div className="d-flex align-items-center">
          <Form.Group controlId="groupInput" className="mb-0 me-2 flex-grow-1">
            <Form.Control type="text" placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleGroupAdd}>
            <i className="bi bi-plus-circle"></i> Create Group
          </Button>
        </div>
        </Form>
      </div>

      <div className="list-group">
        <h6>
        All current groups:
        </h6>
        {groups.map((group, index) => (
          <Button
            variant="primary" type="submit"
            className="d-flex align-items-center list-group-item"
            key={index}
            onClick={() => handleButtonClick(group)}
          >
            {group}
            <Button
            variant="btn-primary" type="button" className="d-flex align-items-center ms-auto"
            onClick={(e) => handleIconClick(index, e)}
            >
              {iconStates[index] ? (
                <i className="bi bi-person-fill-check"></i>
              ) : (
                <i className="bi bi-person-fill-add"></i>
              )}
            </Button>
          </Button>
        ))}
      </div>
    </Container>
  );
}
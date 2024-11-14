import './Groups.css';
import React, { useEffect, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
export default function Groups() {

  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleGroupAdd = (e) => {
    e.preventDefault();
    if (groupName.trim() !== '') {
      setGroups([...groups, groupName]);
      setGroupName('');
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault(e);
  };

  const handleIconClick = (e) => {
    e.preventDefault(e);

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

      <div class="list-group">
        <h6>
        All current groups:
        </h6>
        {groups.map((group, index) => (
          <Button
            variant="primary" type="submit"
            className="d-flex align-items-center list-group-item"
            key={index}
            onClick={() => handleButtonClick()}
          >
            {group}
            <Button
            variant="secondary" type="button" className="d-flex align-items-center ms-auto"
            onClick={() => handleIconClick()}
            >
            <i className="bi bi-person-fill-add"></i>
            </Button>
          </Button>
        ))}
      </div>
    </Container>
  );
}

//note: bi bi-person-fill-check => application sent to group icon
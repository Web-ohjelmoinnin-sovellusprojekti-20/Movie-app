import './Group_page.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Button, Container, Dropdown, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <i
        ref={ref}
        className="bi bi-three-dots-vertical"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    >
        {children}
    </i>
));

const UserRoleContext = createContext();

export default function Group_page() {

    const [members, setMembers] = useState([]);
    const location = useLocation();
    const { groupName } = location.state || {};
    const [role, setRole] = useState("member");

    useEffect(() => {
        if (groupName) {
            setMembers(["Aku", "Tupu", "Hupu", "Lupu"]);
        }

        if (groupName === "Owner") {
            setRole("Owner");
        }
    }, [groupName]);

    return (
        <UserRoleContext.Provider value={role}>
            <div className="page-container">
                <Container>
                    <div className="header-container">
                        <h1>Welcome to {groupName}!</h1>
                        <div className="alert alert-info" role="alert">
                            This is a notification board.
                        </div>
                    </div>
                </Container>
                <Container className="content-container">
                    <Card className="content-card">
                        <Card.Header>Group Movies & Showtimes:</Card.Header>
                        <Card.Body>
                            <img src="..." className="card-img-top" alt="picture goes here"></img>
                            <hr />
                            <Card.Text>Movie info goes here</Card.Text>
                            <hr />
                            <Card.Text>Chosen showtime goes here</Card.Text>
                        </Card.Body>
                    </Card>
                    <div className="right-panel">
                        <div className="member-list">
                            <MemberList members={members} />
                        </div>
                            <RoleBasedActions />
                    </div>
                </Container>
            </div>
        </UserRoleContext.Provider>
    );
}

function MemberList({ members }) {
    const role = useContext(UserRoleContext);

    const handleMemberClick = (member) => {
        // opens account
    };

    return (
        <div>
            <h6>
                All current members:
            </h6>
            {members.map((member, index) => (
                <div className="list-group w-100">
                    <Button
                        className="d-flex align-items-center w-100 list-group-item"
                        variant="primary"
                        key={index}
                        onClick={() => handleMemberClick(member)}
                    >
                        {member}
                        <Dropdown className="ms-auto">
                        <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
                        <Dropdown.Menu>
                            {role === "Owner" ? (
                                <>
                                <Dropdown.Item>Check profile</Dropdown.Item>
                                <Dropdown.Item>Remove from group</Dropdown.Item>
                                </>
                            ) : (
                                <>
                                <Dropdown.Item>Check profile</Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    </Button>
                </div>
            ))}
        </div>
    );
}

function RoleBasedActions() {
    const role = useContext(UserRoleContext);

    return (
        <div>
            {role === "Owner" ? (
                <div>
                    <h6>Owner actions:</h6>
                    <Button variant="danger">Delete Group</Button>
                </div>
            ) : (
                <div>
                    <h6>Member actions:</h6>
                    <Button variant="danger">Leave Group</Button>
                </div>
            )}
        </div>
    );
}
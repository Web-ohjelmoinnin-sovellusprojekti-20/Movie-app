import './Group_page.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Button, Container, Dropdown, Card } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAccount } from '../context/useAccount.js';

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

//fetch join requests for group owner
const fetchJoinRequests = async (groupId, setJoinRequests) => {
    try {
        const response = await axios.get(`http://localhost:3001/groups/${groupId}/join-requests`);
        const joinRequests = response.data;
        setJoinRequests(joinRequests);
        console.log('Pending Join Requests:', joinRequests);
    } catch (err) {
        console.error('Error fetching join requests:', err);
    }
    };

export const fetchGroupMembers = async (groupId, setMembers, setLoading, setRole, account, owner_email) => {
    setLoading(true);
    try {
        if (account && owner_email) {
            if (account.email === owner_email) {
                setRole("Owner");
                console.log("Owner");
            } else {
                setRole("Member");
                console.log("Member");
            }
        }

        if (groupId) {
                const response = await axios.get(`http://localhost:3001/groups/${groupId}/members`);
                setMembers(response.data);
                console.log(response.data);
        } else {
            console.log('No group ID available');
        }
    } catch (error) {
        console.error("Error fetching group members", error);
    } finally {
        setLoading(false);
    }
};

export default function Group_page() {

    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { groupId, groupName, owner_email } = location.state || {};
    const [role, setRole] = useState("");
    const { account } = useAccount();
    const [loading, setLoading] = useState(true);
    const [joinRequests, setJoinRequests] = useState([]);

    console.log('Group ID:', groupId, 'Group Name:', groupName, 'Owner Email:', owner_email);
    console.log('Account Email:', account?.email);

    useEffect(() => {
        if (groupId) {
            fetchGroupMembers(groupId, setMembers, setLoading, setRole, account, owner_email);
            if (role === 'Owner') {
                fetchJoinRequests(groupId, setJoinRequests);
            }
        }
        console.log(role);
    }, [groupId, owner_email, account?.email, role]);

    if (loading) {
        return <div>Loading...</div>;
    };

    const handleOpenProfile = (members) => {
        console.log('Navigating to profile of:', members.member_email);
        navigate("/account", { state: { email: members.member_email } });
    };

    const handleDeleteGroup = async () => {
        console.log('Requesting delete for group ID:', groupId);
        if (window.confirm('Are you sure you want to delete?')) {
            try {
                await axios.delete(`http://localhost:3001/groups/${groupId}`);
                alert('Group deleted successfully');
                navigate('/groups');
            } catch (error) {
                console.error('Error deleting group', error);
                alert('Failed to delete group');
            }
        }
    };

    const handleLeaveGroup = async () => {
        if (window.confirm('Are you sure you want to leave?')) {
            try {
                await axios.delete(`http://localhost:3001/groups/${groupId}/members/${account.email}`);
                alert('You left the group');
                navigate('/groups');
            } catch (error) {
                console.error('Error leaving group', error);
                alert('Failed to leave group');
            }
        }
    };

    const handleRemoveFromGroup = async (member_email) => {
        if (window.confirm('Are you sure you want to remove this member?')) {
            try {
                await axios.delete(`http://localhost:3001/groups/${groupId}/members/${member_email}`);
                alert('Member removed from group');
                fetchGroupMembers(groupId, setMembers, setLoading, setRole, account, owner_email);
            } catch (error) {
                console.error('Error removing member from group', error);
                alert('Failed to remove member');
            }
        }
    };

    return (
        <UserRoleContext.Provider value={{ role, handleOpenProfile, handleDeleteGroup, handleLeaveGroup, handleRemoveFromGroup }}>
            <div className="page-container">
                <Container>
                    <div className="header-container">
                        <h1>Welcome to {groupName || "Loading group..."}</h1>
                        <div className="alert alert-info" role="alert">
                        This is a notification board.
                        <JoinRequestsHandler
                            groupId={groupId}
                            setMembers={setMembers}
                            setLoading={setLoading}
                            setRole={setRole}
                            account={account}
                            owner_email={owner_email}
                            joinRequests={joinRequests}
                            setJoinRequests={setJoinRequests}
                        />
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
};

function MemberList({ members }) {
    const { role, handleOpenProfile, handleRemoveFromGroup } = useContext(UserRoleContext);

    return (
        <div>
            <h6>All current members:</h6>
            {members.map(members => (
                <div className="list-group w-100" key={members.id}>
                    <Button
                        className="d-flex align-items-center w-100 list-group-item"
                        variant="primary"
                    >
                        {members.member_email}
                        <Dropdown className="ms-auto">
                        <Dropdown.Toggle as={CustomToggle}></Dropdown.Toggle>
                        <Dropdown.Menu>
                            {role === "Owner" ? (
                                <>
                                <Dropdown.Item onClick={ () => handleOpenProfile(members)}>Check profile</Dropdown.Item>
                                <Dropdown.Item onClick={ () => handleRemoveFromGroup(members.member_email)}>Remove from group</Dropdown.Item>
                                </>
                            ) : (
                                <>
                                <Dropdown.Item onClick={ () => handleOpenProfile(members)}>Check profile</Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                    </Button>
                </div>
            ))}
        </div>
    );
};

function RoleBasedActions() {
    const { role, handleDeleteGroup, handleLeaveGroup } = useContext(UserRoleContext);

    return (
        <div>
            {role === "Owner" ? (
                <div>
                    <h6>Owner actions:</h6>
                    <Button variant="danger" onClick={handleDeleteGroup}>Delete Group</Button>
                </div>
            ) : (
                <div>
                    <h6>Member actions:</h6>
                    <Button variant="danger" onClick={handleLeaveGroup}>Leave Group</Button>
                </div>
            )}
        </div>
    );
};

const JoinRequestsHandler = ({ groupId, joinRequests, setJoinRequests, setMembers, setLoading, setRole, account, owner_email }) => {
    const handleAcceptRequest = async (requestEmail) => {
      try {
        await axios.patch(`http://localhost:3001/groups/${groupId}/join/${requestEmail}/accept`);
        alert('Request accepted!');
        setJoinRequests(prevRequests => prevRequests.filter(req => req.request_email !== requestEmail)); //remove accepted request

        fetchGroupMembers(groupId, setMembers, setLoading, setRole, account, owner_email);
      } catch (err) {
        console.error('Error accepting request:', err);
      }
    };
  
    const handleDeclineRequest = async (requestEmail) => {
      try {
        await axios.patch(`http://localhost:3001/groups/${groupId}/join/${requestEmail}/decline`);
        alert('Invite declined!');
        setJoinRequests(prevRequests => prevRequests.filter(req => req.request_email !== requestEmail)); //remove declined request
      } catch (err) {
        console.error('Error declining request:', err);
      }
    };
  
    return (
      <div>
        {joinRequests.length > 0 ? (
          <div>
            <h6>Pending join requests:</h6>
            {joinRequests.map((request) => (
              <div key={request.request_email} className="alert alert-warning d-flex justify-content-between">
                <span>New join request from user {request.request_email}</span>
                <div>
                  <Button variant="success" onClick={() => handleAcceptRequest(request.request_email)}>Accept</Button>
                  <Button variant="danger" onClick={() => handleDeclineRequest(request.request_email)}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No pending requests.</div>
        )}
      </div>
    );
  };
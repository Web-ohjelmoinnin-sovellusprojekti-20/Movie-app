import './Account.css';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { Button, Container, Dropdown, Card, Form, Modal } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import account_icon_placeholder from '../images/account_icon_placeholder.png';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../context/useAccount';
import axios from 'axios';

const url = process.env.REACT_APP_API_URL;
export default function Account() {

    const { account } = useAccount();
    const [currentUsername, setCurrentUsername] = useState("Aku Ankka");
    const [tempUsername, setTempUsername] = useState("");
    const [currentEmail] = useState(account.email);
    const [activeSection, setActiveSection] = useState(null);
    const [profilePicture] = useState(account_icon_placeholder);
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const [groups] = useState([]);
    const navigate = useNavigate();

    const handleShowSection = (section) => {
        setActiveSection(section);
        if (section === "username") {
            setTempUsername(currentUsername);
        }
    };

    const handleUsernameChange = () => {
        setCurrentUsername(tempUsername);
        setActiveSection(null);
    };

    const handleCancel = () => {
        setActiveSection(null);
    };

    const handlePasswordChange = () => {
        //password change logic
        setActiveSection(null);
    };

    const handleGroupButtonClick = (group) => {
        navigate("/group_page", { state: { groupName: group } });
    };

    const handleFavoriteButtonClick = () => {
        //open movie info
    };
    
      const handleIconClick = (e) => {
        e.stopPropagation();
        //share favorite list
    };

    return (
        <div className="page-container">
            <div className="top-panel">
                <div className="user-info">
                    <h2>Account Information</h2>
                    <p>Email: {currentEmail}</p>
                    <p>Username: {currentUsername}</p>
                
                    <Container className="link-section">
                        <Link onClick={() => handleShowSection("username")}>
                            Change username
                        </Link>
                        <Link onClick={() => handleShowSection("password")}>
                            Change password
                        </Link>
                        <Link style={{color:"red"}} onClick={() => handleShowSection("delete")}>
                            Delete account
                        </Link>
                    </Container>

                    <div className="change-user-info">
                        {activeSection === "username" && (
                            <div>
                                <h3>Change Username</h3>
                                <input
                                    type="text"
                                    value={tempUsername}
                                    placeholder="Enter new username"
                                    onChange={(e) => setTempUsername(e.target.value)}
                                />
                                <button onClick={handleUsernameChange}>Save</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                        {activeSection === "password" && (
                            <div>
                                <h3>Change Password</h3>
                                <input type="password" placeholder="Enter new password" />
                                <button onClick={handlePasswordChange}>Save</button>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                        {activeSection === "delete" && (
                            <div>
                                <h3>Delete Account</h3>
                                <p>Are you sure you want to delete your account? Warning: all your data will be lost and this action cannot be undone!</p>
                                <button onClick={() => setDeleteModalShow(true)} style={{color:"red"}}>Confirm</button>
                                <DeleteModal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}></DeleteModal>
                                <button onClick={handleCancel}>Cancel</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="profile-picture">
                    <img
                        src={profilePicture}
                        alt="ProfilePicture"
                        style={{
                            width: "15vw",
                            height: "15vw",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "2px solid"
                        }}
                    />
                </div>
            </div>

            <div className="content-panel">
                <div className="left-panel">
                    <div className="list-group">
                        <div className="header-with-share">
                        <h1>My Favorites</h1>
                            <Button
                                variant="light" type="button" className="d-flex align-items-center"
                                onClick={(e) => handleIconClick(e)}
                                >
                                <i class="bi bi-share-fill"></i>
                            </Button>
                        </div>
                        <Button
                            variant="primary" type="submit"
                            className="d-flex align-items-center list-group-item"
                            onClick={() => handleFavoriteButtonClick()}
                        >
                            favorite_example
                        </Button>
                    </div>
                </div>

                <div className="right-panel">
                    <div className="list-group">
                        <h1>My Groups</h1>
                        {groups.map((group, index) => (
                            <Button
                                variant="primary" type="submit"
                                className="d-flex align-items-center list-group-item"
                                key={index}
                                onClick={() => handleGroupButtonClick(group)}
                            >
                                {group}
                            </Button>
                        ))}
                            <Button
                                variant="primary" type="submit"
                                className="d-flex align-items-center list-group-item"
                                onClick={() => handleGroupButtonClick()}
                            >
                                group_example
                            </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DeleteModal(props) {
  const [show, setShow] = useState(false);
  const { account, logOut } = useAccount();
  const [passwordFromInput, setPasswordFromInput] = useState('');
  const navigate = useNavigate();
  const handleDelete = async (e) => {
    e.preventDefault();
    const payload = {
        email: account.email,
        password: passwordFromInput
    };
    try {
        await axios.delete(url + '/account/delete', {
            headers: { Authorization: account.token },
            data: payload
        }).then((response) => {
            logOut();
            navigate('/');
        }).catch((error) => {
            alert(error);
        });
    } catch (error) {
        alert(error);
    }
    props.onHide();
};

  return (
    <Modal
      {...props}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header>
        <Modal.Title id='contained-modal-title-vcenter'>
          Delete Account
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleDelete}>
        <Modal.Body>
          <h6>Enter password to delete your account</h6>
          <Form.Group className='mb-3' controlId='formBasicPassword'>
            <Form.Control
              type='password'
              placeholder='Enter password'
              onChange={(e) => setPasswordFromInput(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' type='submit'>
            Delete
          </Button>
          <Button variant='secondary' onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

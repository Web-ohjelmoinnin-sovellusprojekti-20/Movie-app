import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Dropdown, Row } from 'react-bootstrap';
import { xml2js } from 'xml-js';
import { getAll, getDate } from '../components/kinoAPI';
import PaginationComp from '../components/Pagination.js';
import { useAccount } from '../context/useAccount';
import './Showtimes.css';

const base_url = 'https://www.finnkino.fi/xml/';

export default function ShowTimes() {
  const { account } = useAccount();
  const [email, setEmail] = useState(account?.email || '');
  const [areas, setAreas] = useState([]);
  const [theater, setTheater] = useState(null);
  const [theaterName, setTheaterName] = useState(null);
  const [showingDate, setShowingDate] = useState(null);
  const [showingData, setShowingData] = useState(null);
  const [page, setPage] = useState(1);
  const [userGroups, setUserGroups] = useState([]);

  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = showingData ? showingData.slice(startIndex, endIndex) : [];

  useEffect(() => {
    console.log('Fetching profile for email:', email);
    const fetchUserGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/groups/user/${email}`);
        console.log('User groups:', response.data);
        setUserGroups(response.data);
      } catch (err) {
        console.error('Error fetching user groups:', err);
      }
    };
    fetchUserGroups();
  }, [email]);

  const handleKinoData = async () => {
    if (theater && showingDate) {
      const selectedData = await getAll(theater, showingDate);
      setShowingData(selectedData);
      const selectedTheater = areas.find((area) => area.id === theater);
      setTheaterName(selectedTheater ? selectedTheater.name : 'unknown');
    }
  };

  const kinoTheaters = (xml) => {
    const xmlDoc = xml2js(xml, { compact: true });
    const theaters = xmlDoc.TheatreAreas.TheatreArea;
    const area = theaters.map((theater) => ({
      name: theater.Name._text,
      id: theater.ID._text,
    }));
    setAreas(area);
  };

  useEffect(() => {
    axios
      .get(base_url + 'TheatreAreas/')
      .then((response) => kinoTheaters(response.data))
      .catch((error) => {
        console.error('Error fetching theaters:', error);
      });
  }, []);

  useEffect(() => {
    if (theater && showingDate) {
      handleKinoData();
    }
  }, [theater, showingDate]);

  const handleShowtimeTransfer = async (showtime, groupName) => {
    try {
      await axios.post('http://localhost:3001/showtimes/send', { showtime, groupName });
      alert('Successfully sent showtime to group!');
    } catch (error) {
      alert('Error sending showtime');
      console.error('Error sending showtime to destination:', error);
    }
  };

  return (
    <div>
      <h2>Select theater and date, search is automatic</h2>
      <div className="dropdown-box">
        <Dropdown>
          <Dropdown.Toggle>{theaterName || 'Select theater'}</Dropdown.Toggle>
          <Dropdown.Menu>
            {areas.map((area, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  setTheater(area.id);
                  setTheaterName(area.name);
                }}
              >
                {area.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown>
          <Dropdown.Toggle>{showingDate || 'Select date'}</Dropdown.Toggle>
          <Dropdown.Menu>
            {getDate().map((date, index) => (
              <Dropdown.Item
                key={index}
                onClick={() => {
                  setShowingDate(date);
                }}
              >
                {date}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <Container>
          {showingData && (
            <Row>
              {paginatedData.map((showing, index) => (
                <Col lg={3} md={3} sm={6} xs={12} key={index}>
                  <Card>
                    <Card.Img src={showing.image} fluid />
                    <br />
                    <Card.Body className="showings">
                      <Card.Title>
                        <u>
                          <a href={showing.link} target="_blank" rel="noopener noreferrer">
                            {showing.title}
                          </a>
                        </u>
                      </Card.Title>
                      <br />
                      <Dropdown>
                        <Dropdown.Toggle>Share with a group</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {userGroups.map((group, index) => (
                            <Dropdown.Item
                              key={index}
                              onClick={() => handleShowtimeTransfer(showing, group.group_name)}
                            >
                              {group.group_name}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                      <Card.Text>
                        <br/><br/>
                        <strong>Theatre: {theaterName || 'Select theatre'}</strong>
                        <br /><br/>
                        <strong>Auditorium: {showing.auditorium || 'N/A'}</strong>
                        <br /><br/>
                        <strong>Date: {showingDate || 'Select date'}</strong>
                        <br /><br/>
                        <strong>Starts: {showing.formattedTime}</strong>
                        <br /><br/>
                        <strong>Ends: {showing.formattedTime2}</strong>
                        <br /><br/>
                        <strong>Length: {showing.minutes} minutes</strong>
                        <br /><br/>
                        <strong>Genre: {showing.genre || 'N/A'}</strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
          <div className="pagination">
            <PaginationComp
              total={showingData ? Math.ceil(showingData.length / itemsPerPage) : 0}
              current={page}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </Container>
      </div>
    </div>
  );
}

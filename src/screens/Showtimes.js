import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { getMovieByTheaterAndDate, getMovieStartTime } from '../components/kinoAPI';
import './Showtimes.css';

export default function Showtimes() {
  
  const [theaterData, setTheaterData] = useState(null)
  const [date, setDate] = useState(null)
  const [theaterId, setTheaterId] = useState(null)
  const [theaterName, setTheaterName] = useState(null)
  const [movieStart, setMovieStart] = useState(null)

  const getDate = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 10; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear())
    }
    return dates
  }

  const handleKinoData = async() => {
    if (theaterId && date) {
      try {
        const selectedData = await getMovieByTheaterAndDate(theaterId, date)
        const startTime = await getMovieStartTime(movieStart, date)
        setTheaterData(selectedData)
        setMovieStart(startTime)
      } catch (error) {
        throw error
      }
    } else {
      alert("Please select a valid theater and date")
    }
  }

  return (
    <div>
      <div className="dropdown-box">
      <Dropdown>
          <Dropdown.Toggle className="dropdown-theaters" variant="success" id="dropdown-theaters">
            Theaters
          </Dropdown.Toggle>

          <Dropdown.Menu>
            
            <Dropdown.Item onClick={() => {
              setTheaterId(1012);
              setTheaterName('Espoo')
            }}>Espoo</Dropdown.Item>
            
            <Dropdown.Item onClick={() => {
              setTheaterId(1039);
              setTheaterName('Espoo: OMENA')
            }}>Espoo: OMENA</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1038);
              setTheaterName('Espoo: SELLO')
            }}>Espoo: SELLO</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1002);
              setTheaterName('Helsinki')
            }}>Helsinki</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1045);
              setTheaterName('Helsinki: ITIS')
            }}>Helsinki: ITIS</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1032);
              setTheaterName('Helsinki: MAXIM')
            }}>Helsinki: MAXIM</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1033);
              setTheaterName('Helsinki: TENNISPALATSI')
            }}>Helsinki: TENNISPALATSI</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1013);
              setTheaterName('Vantaa: FLAMINGO')
            }}>Vantaa: FLAMINGO</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1015);
              setTheaterName('Jyäskylä: FANTASIA')
            }}>Jyväskylä: FANTASIA</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1016);
              setTheaterName('Kuopio: SCALA')
            }}>Kuopio: SCALA</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1017);
              setTheaterName('Lahti: KUVAPALATSI')
            }}>Lahti: KUVAPALATSI</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1041);
              setTheaterName('Lappeenranta: STRAND')
            }}>Lappeenranta: STRAND</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1018);
              setTheaterName('Oulu: PLAZA')
            }}>Oulu: PLAZA</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1019);
              setTheaterName('Pori: PROMENADI')
            }}>Pori: PROMENADI</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1021);
              setTheaterName('Tampere')
            }}>Tampere</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1034);
              setTheaterName('Tampere: CINE ATLAS')
            }}>Tampere: CINE ATLAS</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1035);
              setTheaterName('Tampere: PLEVNA')
            }}>Tampere: PLEVNA</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1047);
              setTheaterName('Turku ja Raisio')
            }}>Turku ja Raisio</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1022);
              setTheaterName('Turku: KINOPALATSI')
            }}>Turku: KINOPALATSI</Dropdown.Item>

            <Dropdown.Item onClick={() => {
              setTheaterId(1046);
              setTheaterName('Raisio: LUXE MYLLY')
            }}>Raisio: LUXE MYLLY</Dropdown.Item>

          </Dropdown.Menu>

        </Dropdown>

        <Dropdown> 
      
          <Dropdown.Toggle className="dropdown-dates" variant="info" id="dropdown-dates">
            Dates
          </Dropdown.Toggle>
      
    
      

        <Dropdown.Menu>
          {getDate().map((date, index) => (
            <Dropdown.Item key={index} onClick={() => setDate(date)}>{date}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      
      </Dropdown>
      </div>
      <button className="button" onClick={handleKinoData}>Search</button>
      {theaterData && (
        <div>
          <h2>Movies:</h2>
          <ul className="movies-box">
            {theaterData.map((theaterData, index) => (
              <li key={index}>{theaterData} | <strong>{theaterName} |</strong></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
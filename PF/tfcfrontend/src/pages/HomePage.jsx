import {React, useState, useEffect} from 'react'
import {useLoadScript} from "@react-google-maps/api"
import "./HomePage.css"
import Title from '../components/Title';
import Map from "../components/Map"
import { getListOfStudios } from '../api/requests'
import { StudioCard } from '../components/studios/StudioCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Home() {
  const [studios, setStudios] = useState([])
  
  useEffect(() => {
    getListOfStudios(setStudios)
  }, [])

  return (
    <>
      <Title title="Studios"/>
      <div className="homepage-body-container">
        <div className="studio-cards-container">
          <Row>
            {studios.map((studio) => (
              <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={4}>
                <StudioCard studio={studio} />
              </Col>
            ))}
          </Row>
        </div>
        <div className="map-filterbar-container">
          <Map studios={studios}/>
        </div>
      </div>
    </>
  )
}

export default Home
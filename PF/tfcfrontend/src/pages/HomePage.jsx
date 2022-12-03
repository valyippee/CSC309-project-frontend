import {React, useState, useEffect} from 'react'
import "./HomePage.css"
import Title from '../components/Title';
import Map from "../components/Map"
import { getListOfStudios } from '../api/requests'
import { StudioCard } from '../components/studios/StudioCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Home() {
  const [currentLocation, setCurrentLocation] = useState({lat: 43.65, lng: -79.38}) // DEFAULT COORDS is TORONTO
  const [studios, setStudios] = useState([])
  
  useEffect(() => {
    getListOfStudios(setStudios, {location: currentLocation})

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude}) // USERS CURRENT LOCATION COORDS
      })
    }
  }, [])

  useEffect(() => {
    getListOfStudios(setStudios, {location: currentLocation})
  }, [currentLocation])

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
          <Map studios={studios} currentLocation={currentLocation}/>
        </div>
      </div>
    </>
  )
}

export default Home
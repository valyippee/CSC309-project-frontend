import {React, useState, useEffect} from 'react'
import "./HomePage.css"
import Title from '../components/Title';
import Map from "../components/Map"
import StudiosFilterBar from '../components/studios/StudiosFilterBar';
import { getListOfStudios, getListOfStudiosByPaginationUrl } from '../api/requests'
import { StudioCard } from '../components/studios/StudioCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

function Home() {
  const [currentLocation, setCurrentLocation] = useState({lat: 43.65, lng: -79.38}) // DEFAULT COORDS is TORONTO
  const [studios, setStudios] = useState([])
  const [selectedFilterTags, setSelectedFilterTags] = useState({})
  const [studiosPaginationNextUrl, setStudiosPaginationNextUrl] = useState("")
  
  useEffect(() => {
    getListOfStudios(setStudios, {location: currentLocation}, setStudiosPaginationNextUrl)

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLocation({lat: position.coords.latitude, lng: position.coords.longitude}) // USERS CURRENT LOCATION COORDS
      })
    }
  }, [])

  useEffect(() => {
    getListOfStudios(setStudios, {location: currentLocation, selectedFilterTags: selectedFilterTags}, setStudiosPaginationNextUrl)
  }, [currentLocation, selectedFilterTags])

  const handleStudioCardsScroll = (e) => {
    const bottom = Math.abs(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight) <= 200
    if (bottom) {
      getListOfStudiosByPaginationUrl(studios, setStudios, studiosPaginationNextUrl, setStudiosPaginationNextUrl)
    }
  }

  return (
    <>
      <Title title="Studios"/>
      <div className="homepage-body-container">
        <div className="studio-cards-container" onScroll={(e) => {handleStudioCardsScroll(e)}}>
          <Row style={{width: "100%"}}>
            {studios.map((studio) => (
              <Col xs={12} sm={6} md={6} lg={6} xl={6} xxl={4}>
                <StudioCard key={studio.id} studio={studio} />
              </Col>
            ))}
          </Row>
        </div>
        <div className="map-filterbar-container">
          <Map studios={studios} currentLocation={currentLocation}/>
          <StudiosFilterBar setSelectedFilterTags={setSelectedFilterTags}/>
        </div>
      </div>
    </>
  )
}

export default Home
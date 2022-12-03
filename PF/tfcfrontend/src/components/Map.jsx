import React from 'react'
import {GoogleMap, Marker, LoadScript} from "@react-google-maps/api"
import "./Map.css"

function Map({studios}) {

  return (
    <LoadScript googleMapsApiKey="AIzaSyArL5pdy_Z4Ocy4L8ruOTImDXrYV3p159k">
        <GoogleMap zoom={10} center={{lat: 43.65, lng: -79.38}} mapContainerClassName="google-map-container">
            {studios.map((studio) => (
                <Marker position={{lat: studio.lat, lng: studio.lon}} label={studio.name} />
            ))}
        </GoogleMap>
    </LoadScript>
  )
}

export default Map
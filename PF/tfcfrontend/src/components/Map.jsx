import React from "react";
import { GoogleMap, MarkerF, LoadScript } from "@react-google-maps/api";
import "./Map.css";

function Map({ studios, currentLocation }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyArL5pdy_Z4Ocy4L8ruOTImDXrYV3p159k">
      <GoogleMap
        zoom={10}
        center={currentLocation}
        mapContainerClassName="google-map-container"
      >
        {studios.map((studio) => (
          <MarkerF
            key={studio.id}
            position={{ lat: studio.lat, lng: studio.lon }}
            label={studio.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default Map;

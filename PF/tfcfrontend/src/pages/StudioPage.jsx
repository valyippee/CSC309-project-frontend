import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import "./StudioPage.css";
import { getStudioInfo } from "../api/requests";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { MapPin, Phone, Check } from "react-feather";

const StudioPage = () => {
  let { studio_id } = useParams();
  const [studioInfo, setStudioInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudioInfo(setStudioInfo, studio_id);
  }, []);

  useEffect(() => {
    if (Object.keys(studioInfo).length !== 0) {
      setLoading(false);
    }
  }, [studioInfo]);

  if (loading) {
    return (
      // TODO - Add a spinner here?
      <></>
    );
  } else {
    return (
      <>
        <Title title={"Studio - " + studioInfo.name} />
        <div className="studiopage-body-container">
          <div className="studiopage-body-top-container">
            <div className="amenities-container">
              <h2>Amenities</h2>
              <div className="amenities-table-container">
                <Table>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Type</th>
                      <th style={{textAlign: "center"}}>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studioInfo.amenities.map((amenity) => (
                        <tr>
                            <td><Check/></td>
                            <td>{amenity.amenity_type}</td>
                            <td style={{textAlign: "center"}}>{amenity.quantity}</td>
                        </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="studio-general-info-container">
              <div className="studio-image-container">
                <img src={studioInfo.images[0].studio_image}></img>
              </div>
              <div className="studio-info-labels-container">
                <h3>Contact</h3>
                <div className="studio-info-labels-icon-p-container">
                  <Phone></Phone>
                  <p>{studioInfo.phone_number}</p>
                </div>
              </div>
              <div className="studio-info-labels-container">
                <h3>Address</h3>
                <div className="studio-info-labels-icon-p-container">
                  <MapPin></MapPin>
                  <p>
                    {studioInfo.address}, {studioInfo.postal_code}
                  </p>
                </div>
              </div>
              <div className="studio-directions-button-container">
                <Button
                  href={studioInfo.directions_url}
                  target="_blank"
                  className="studio-directions-button"
                >
                  Directions
                </Button>
              </div>
            </div>
          </div>
          <div className="studiopage-body-bottom-container">
            {/* TODO Filter And Calendar Component Placed Here */}
          </div>
        </div>
      </>
    );
  }
};

export default StudioPage;
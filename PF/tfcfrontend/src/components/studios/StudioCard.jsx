import React from "react";
import Card from "react-bootstrap/Card";
import "./StudioCard.css";
import { useNavigate } from "react-router-dom";

export const StudioCard = ({ studio }) => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/studio/" + studio.id)
  };

  return (
    <Card className="studio-card-container" onClick={() => handleOnClick()}>
      <Card.Body>
        <Card.Title>{studio.name}</Card.Title>
        <Card.Text>{studio.address}</Card.Text>
      </Card.Body>
      <img src={studio.images[0].studio_image} style={{ objectFit: "cover", height: "200px" }} />
    </Card>
  );
};

import React from 'react'
import Card from 'react-bootstrap/Card';
import "./StudioCard.css"

export const StudioCard = ({studio}) => {
  return (
    <div>
        <Card className="studio-card-container" >
            <Card.Body>
                <Card.Title>{studio.name}</Card.Title>
                <Card.Text>{studio.address}</Card.Text>
            </Card.Body>
            <Card.Img variant="bottom" src={studio.images[0].studio_image} style={{ objectFit: "cover", height: "200px"}}/>
        </Card>
    </div>
  )
}

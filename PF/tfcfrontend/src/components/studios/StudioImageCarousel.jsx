import React from "react";
import "./StudioImageCarousel.css";
import Carousel from "react-bootstrap/Carousel";
import Image from 'react-bootstrap/Image'

const StudioImageCarousel = ({ images }) => {
  return (
    <Carousel className="studio-image-carousel">
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <Image src={image.studio_image} className="studio-image" />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default StudioImageCarousel;

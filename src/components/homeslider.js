// ImageSlider.js
import React from 'react';
import Slider from 'react-slick';
import { Box, Image } from '@chakra-ui/react';

const ImageSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    nav: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const images = [
    // Add your image URLs here
    'https://ponds.in/cdn/shop/files/Updated-SAL-Banners-_1400x400_revised.png?v=1718891531',
    'https://ponds.in/cdn/shop/files/Home-Page-Main-Banner_best-seller_Desktop_2552x730_e8d92128-0aa5-4aa6-a596-10bd146dbeac.png?v=1720585271',
    'https://ponds.in/cdn/shop/files/Updated-SAL-Banners-_1400x400_revised.png?v=1718891531',
  ];

  return (
    <Box width="full"  mx="auto">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Image src={image} alt={`Slide ${index + 1}`} width="100%" />
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageSlider;

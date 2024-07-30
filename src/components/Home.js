// Home.js
import React from 'react';
import ImageSlider from './homeslider'; // Import the ImageSlider component
import ProductSlider from './Featured_collection';

const Home = () => {
  return (
    <div>
      <ImageSlider />
      <ProductSlider collectionHandle="hydrogen" />
    </div>
  );
};

export default Home;

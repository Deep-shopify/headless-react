// Home.js
import React from 'react';
import ImageSlider from './homeslider'; // Import the ImageSlider component
import ProductSlider from './Featured_collection';


const Home = ({ client }) => {
  return (
    <div>
      <ImageSlider />
      <ProductSlider client={client} handle="automated-collection" />
    </div>
  );
};

export default Home;

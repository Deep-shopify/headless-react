// ProductSlider.js

import React, { useEffect, useState } from 'react';
import {  Center, Box } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../index.css';

const ProductSlider = ({ client, handle }) => {
    const settings = {
        dots: false,
        infinite: true,
        nav: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
      };

    console.log(client);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const ITEMS_PER_LOAD = 10; // Define how many items to load initially

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        // Check if client is defined
        if (!client) {
          throw new Error('Client is not properly initialized or fetchByHandle is not a function');
        }

        // Fetch the collection using the handle
        const fetchedCollection = await client.collection.fetchByHandle(handle);

        // Check if fetchedCollection is valid
        if (!fetchedCollection || !fetchedCollection.products) {
          throw new Error('Fetched collection is invalid or does not contain products');
        }

        // Set the displayed products to only those in the fetched collection
        setDisplayedProducts(fetchedCollection.products.slice(0, ITEMS_PER_LOAD)); // Load initial items
      } catch (error) {
        console.error('Error fetching collection:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [client, handle]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching collection: {error.message}</p>;

  return (
    <div className="product-slider">
          <Center>
  {displayedProducts.length > 0 ? (
  <Box maxW="1366px" w="full" p={4}>
         <Slider {...settings} >
      {displayedProducts.map(product => (
      
          <div className="product-item">
          <Link to={`/product/${product.id.split('/').pop()}`}>
          <Center> {product.images && product.images.length > 0 && (
              <img src={product.images[0].src} alt={product.images[0].altText} />
            )}
            </Center>
            </Link>
        
            <div class="product-info">
            <h2>{product.title}</h2>
            <p>{product.variants[0].priceV2.amount} {product.variants[0].priceV2.currencyCode}</p>
            <a href={`/product/${product.id.split('/').pop()}`}>View Product</a>
            </div>
          </div>
       
      ))}
          </Slider>
          </Box>
  ) : (
    <p>No products found in this collection.</p>
  )}
  </Center>
</div>
  );
};

export default ProductSlider;

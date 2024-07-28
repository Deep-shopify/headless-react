// src/components/ProductList.js

import React, { useState, useEffect } from 'react';
import { Box, Grid, Text, Image, Center, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Import Link

const ITEMS_PER_LOAD = 9; // Number of items to load each time

const ProductList = ({ client }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  useEffect(() => {
    client.product.fetchAll()
      .then((fetchedProducts) => {
        setProducts(fetchedProducts);
        setDisplayedProducts(fetchedProducts.slice(0, ITEMS_PER_LOAD)); // Load initial items
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, [client]);

  const loadMore = () => {
    const nextItems = products.slice(displayedProducts.length, displayedProducts.length + ITEMS_PER_LOAD);
    setDisplayedProducts([...displayedProducts, ...nextItems]);
  };

  return (
    <Center>
      <Box maxW="1366px" w="full" p={4}>
        {loading ? (
          <Text>Loading products...</Text>
        ) : (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product) => {
                  // Extract the numeric ID from the global ID
                  const numericId = product.id.split('/').pop(); // This will give you '8656485712125'
                  return (
                    <Link to={`/product/${numericId}`} key={product.id}> {/* Use the numeric ID */}
                      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
                        <Image src={product.images[0]?.src} alt={product.title} boxSize="200px" objectFit="cover" />
                        <Box p={4}>
                          <Text fontWeight="bold">{product.title}</Text>
                          <Text>
                            ${product.variants[0]?.price?.amount || '0.00'}
                          </Text>
                        </Box>
                      </Box>
                    </Link>
                  );
                })
              ) : (
                <Text>No products available.</Text>
              )}
            </Grid>
            {displayedProducts.length < products.length && (
              <Button mt={4} onClick={loadMore}>
                Load More
              </Button>
            )}
          </>
        )}
      </Box>
    </Center>
  );
};

export default ProductList;

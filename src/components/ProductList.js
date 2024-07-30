import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Grid,  Text,  Image, Center, Button,Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, Flex} from '@chakra-ui/react';

const ProductList = ({ client }) => {
  const { handle } = useParams(); // Get the collection handle from the URL
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Set a default max price
  const ITEMS_PER_LOAD = 6; // Number of items to load each time

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        // Fetch the collection using the handle
        const fetchedCollection = await client.collection.fetchByHandle(handle);
        
        // Set the collection
        setCollection(fetchedCollection);

        // Set the displayed products to only those in the fetched collection
        setDisplayedProducts(fetchedCollection.products.slice(0, ITEMS_PER_LOAD)); // Load initial items
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [client, handle]);

  const loadMore = () => {
    const nextItems = collection.products.slice(displayedProducts.length, displayedProducts.length + ITEMS_PER_LOAD);
    setDisplayedProducts([...displayedProducts, ...nextItems]);
  };

  const filterProducts = () => {
    const filtered = collection.products.filter((product) => {
      const price = parseFloat(product.variants[0]?.price?.amount);
      return price >= minPrice && price <= maxPrice;
    });
    setDisplayedProducts(filtered.slice(0, 9)); // Reset displayed products with filtered ones
  };

  if (loading) {
    return (
      <Center>
        <Text>Loading products...</Text>
      </Center>
    );
  }

  if (!collection) {
    return <Text>Collection not found.</Text>;
  }

  return (
    <Center>
      <Box maxW="1366px" w="full" p={4}>
        <Flex mb={4} alignItems="center">
          <Text mr={4}>Price Range: ${minPrice} - ${maxPrice}</Text>
        </Flex>

        {/* Range Slider for Price Filtering */}
        <Slider
          min={0}
          max={1000}
          step={10}
          defaultValue={[minPrice, maxPrice]}
          onChangeEnd={(val) => {
            setMinPrice(val[0]);
            setMaxPrice(val[1]);
            filterProducts(); // Filter products when the slider is adjusted
          }}
          value={[minPrice, maxPrice]}
          sx={{
            track: {
              bg: 'gray.200',
              height: '6px',
              borderRadius: 'full',
            },
            thumb: {
              bg: 'teal.500',
              width: '20px',
              height: '20px',
              borderRadius: 'full',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              _hover: {
                bg: 'teal.600',
              },
              _active: {
                bg: 'teal.700',
              },
            },
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb index={0} />
          <SliderThumb index={1} />
          <SliderMark value={minPrice} mt="2" ml="-2.5" fontSize="sm">
            ${minPrice}
          </SliderMark>
          <SliderMark value={maxPrice} mt="2" ml="-2.5" fontSize="sm">
            ${maxPrice}
          </SliderMark>
        </Slider>

        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {displayedProducts.map((product) => (
            <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Link to={`/product/${product.id.split('/').pop()}`}>
              <Center> <Image src={product.images[0]?.src} alt={product.title} boxSize="200px" objectFit="cover" /> </Center>
                <Box p={4}>
                <Center> <Text fontWeight="bold">{product.title}</Text> </Center>
                <Center>  <Text>${product.variants[0]?.price?.amount || '0.00'}</Text> </Center>
                </Box>
              </Link>
            </Box> 
          ))}
        </Grid>

        {displayedProducts.length < collection.products.length && (
         <Center>
          <Button mt={4} onClick={loadMore}>
            Load More
          </Button>
          </Center>
        )}
      </Box>
    </Center>
  );
};

export default ProductList;

import React, { useEffect, useState } from 'react';
import { Box, Text, Image, Grid, Center, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const CollectionsPage = ({ client }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await client.collection.fetchAll(); // Fetch all collections
        const collectionsWithProducts = await Promise.all(
          response.map(async (collection) => {
            // Fetch products for each collection
            const products = await client.collection.fetchWithProducts(collection.id);
            return {
              ...collection,
              products,
            };
          })
        );
        setCollections(collectionsWithProducts);
      } catch (error) {
        setError('Failed to fetch collections');
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, [client]);

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Center>
    <Box maxW="1366px" w="full" p={4}>
    <Center>  <Text fontSize="2xl" mb={4}>Collections</Text> </Center>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {collections.map((collection) => {
          // Determine the image to display
          const collectionImage = collection.image?.src;
          const firstProductImage = collection.products[0]?.images[0]?.src;

          const displayImage = collectionImage || firstProductImage || 'https://cdn.shopify.com/s/files/1/0711/3870/5661/files/Main.jpg?v=1721990967'; // Fallback to a default image if neither is available

          return (
            <Link to={`/collections/${collection.handle.split('/').pop()}`} key={collection.id}>
              <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
              <Center>   <Image src={displayImage} alt={collection.title} boxSize="300px" objectFit="cover" /></Center>
                <Box p={4}>
                  <Center>   
                    <Text fontWeight="bold">{collection.title}</Text>
                    </Center>
                    <Center> 
                  <Text>View Collection</Text> 
                  </Center>
                </Box>
              </Box>
            </Link>
          );
        })}
      </Grid>
    </Box>
    </Center>
  );
};

export default CollectionsPage;

import React, { useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom'; 
import { Heading, Box, Grid, Text, Image, Center, Button, Flex, RangeSlider, RangeSliderFilledTrack, RangeSliderThumb, RangeSliderTrack, Tag, WrapItem } from '@chakra-ui/react'; 
import axios from 'axios';

const ProductList = ({ client, addToCart  }) => {
  const { handle } = useParams(); // Get the collection handle from the URL
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000); // Set a default max price
  const [maxPrice_static, setMaxPrice_static] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tags, setTags] = useState([]);
  const ITEMS_PER_LOAD = 6; // Number of items to load each time

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        // Fetch the collection using the handle
        const fetchedCollection = await client.collection.fetchByHandle(handle);
        // console.log('Fetched Collection:', fetchedCollection); // Log the entire fetched collection
        
        // Set the collection
        setCollection(fetchedCollection);

        // Set the displayed products to only those in the fetched collection
        setDisplayedProducts(fetchedCollection.products.slice(0, ITEMS_PER_LOAD)); // Load initial items

        // Calculate max price based on fetched products
        const prices = fetchedCollection.products.map(product => parseFloat(product.variants[0]?.price?.amount));
        const calculatedMaxPrice = Math.max(...prices);
        setMaxPrice(calculatedMaxPrice); // Set max price based on fetched products
        setMinPrice(0); // Reset min price to 0
        const maxPrice_static = Math.max(...prices);
        setMaxPrice_static(maxPrice_static);  

        // Set the initial filtered products
        setFilteredProducts(fetchedCollection.products);
      } catch (error) {
        console.error('Error fetching collection:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTags = async () => {
      try {
        const response = await axios.post('https://react-demo-store-2024.myshopify.com/api/2024-01/graphql.json', {
          query: `
            query {
              products(first: 100) {
                edges {
                  node {
                    tags
                  }
                }
              }
            }
          `
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': '1b1f74c659da24e743c82345740c47f2',
          }
        });

        const allTags = response.data.data.products.edges.flatMap(edge => edge.node.tags);
        const uniqueTags = [...new Set(allTags)]; // Get unique tags
        setTags(uniqueTags);
        // console.log(uniqueTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
    fetchCollection();
  }, [client, handle]);

  const loadMore = () => {
    const nextItems = filteredProducts.slice(displayedProducts.length, displayedProducts.length + ITEMS_PER_LOAD);
    setDisplayedProducts([...displayedProducts, ...nextItems]);
  };

  const filterProducts = (min, max) => {
    const filtered = collection.products.filter((product) => {
  
      const price = parseFloat(product.variants[0]?.price?.amount);
      return price >= min && price <= max;
    });
    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, ITEMS_PER_LOAD)); // Reset displayed products with filtered ones
  };

  const handleSliderChange = (val) => {
    setMinPrice(val[0]);
    setMaxPrice(val[1]);
    filterProducts(val[0], val[1]); // Filter products when the slider is adjusted
  };

  const handleTagClick = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag) // Remove tag if already selected
      : [...selectedTags, tag]; // Add tag if not selected

    setSelectedTags(newSelectedTags);

    // Filter products based on selected tags
    

    const fetchTags_collection = async () => {
      try {
        const response = await axios.post('https://react-demo-store-2024.myshopify.com/api/2024-01/graphql.json', {
          query: `
            query {
              collection(handle: "${handle}") {
                title
                products(first: 100) {
                  edges {
                    node {
                      id
                      title
                      tags
                      variants(first: 1) {
                        edges {
                          node {
                            price {
                              amount
                            }
                          }
                        }
                      }
                      images(first: 1) {
                        edges {
                          node {
                            src
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': '1b1f74c659da24e743c82345740c47f2',
          }
        });

        const allTags = response.data.data.collection.products.edges.flatMap(edge => edge.node.tags);
        const uniqueTags = [...new Set(allTags)]; // Get unique tags
        setTags(uniqueTags);
        console.log('unique Tages collection found: ');
        console.log(uniqueTags);

        const filtered = response.data.data.collection.products.edges.filter(edge => {
          console.log('collection products: ');
          const product1 = edge.node;
          console.log(product1.tags); 
          // Ensure product.tags exists and is an array before calling .some();
          const hasTag = product1.tags && Array.isArray(product1.tags) && product1.tags.some(t => newSelectedTags.includes(t));
          return hasTag;
        });
    
        setFilteredProducts(filtered);
        setDisplayedProducts(filtered.slice(0, ITEMS_PER_LOAD)); // Reset displayed products with filtered ones
    

      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags_collection();

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

  // Calculate the filtered products based on current min and max price
  const showLoadMoreButton = filteredProducts.length > displayedProducts.length;

  // Get unique tags from the products
  const allTags = {tags};
  const filter_tags = allTags.tags;
  // console.log(filter_tags);

  return (
    <Center>
      <Box maxW="1366px" w="full" p={4} mt={7}>
        {/* Full-width heading */}
        <Box width="100%">
          <Heading as="h1" size="lg" textAlign="center" mb={7}>
            {collection.title}
          </Heading>
        </Box>

        {/* Tag Filter */}
       

        {/* Responsive Grid Layout */}
        <Grid
          templateColumns={{ base: '1fr', md: '20% 80%' }} // 100% on mobile, 20% and 80% on desktop
          gap={4} // Optional: adjust the gap between columns
        >
          {/* Left Sidebar for Price Range */} 
          <Box bg="white" p={4} color="#000">
          <Flex mb={4} wrap="wrap">
          {filter_tags.length > 0 ? (
            filter_tags.map(tag => (
              <WrapItem key={tag}>
                <Tag
                  size="md"
                  variant={selectedTags.includes(tag) ? "solid" : "outline"}
                  colorScheme={selectedTags.includes(tag) ? "teal" : "gray"}
                  onClick={() => handleTagClick(tag)}
                  cursor="pointer"
                  mr={2}
                  mb={2}
                >
                  {tag}
                </Tag>
              </WrapItem>
            ))
          ) : (
            <Text>No tags available.</Text> // Show if no tags are found
          )}
        </Flex> 

            <Flex mb={4} alignItems="center">
              <Text mr={4}>Price Range: ${minPrice} - ${maxPrice}</Text>
            </Flex>

            {/* Range Slider for Price Filtering */}
            <RangeSlider
              aria-label="Select price rang"
              min={0}
              max={maxPrice_static} // Set max to the maximum price of the products
              defaultValue={[minPrice, maxPrice]}
              onChange={handleSliderChange}
              value={[minPrice, maxPrice]}
            >
              <RangeSliderTrack>
                <RangeSliderFilledTrack />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
              <RangeSliderThumb index={1} />
            </RangeSlider>
          </Box>

          {/* Right Main Content Area */}
          <Box bg="white" p={4} color="#000">
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
              {displayedProducts.map((product) => (
                <Box key={product.id} borderWidth="1px" borderRadius="lg" overflow="hidden">
                 
                    <Center>
                    <Link to={`/product/${product.id.split('/').pop()}`}> <Image
                        src={product.images[0]?.src}
                        alt={product.title}
                        boxSize="200px"
                        objectFit="cover"
                      /> </Link>
                    </Center>
                    <Box p={4}>
                      <Center>
                        <Text fontWeight="bold">{product.title}</Text>
                      </Center>
                      <Center>
                        <Text>₹{product.variants[0]?.price?.amount || '0.00'}</Text>
                      </Center>
                      {/* Display product tags */}
                      <Flex wrap="wrap" mt={2}>
                        {product.tags && product.tags.map(tag => (
                          <Tag key={tag} size="sm" variant="solid" colorScheme="blue" mr={1} mb={1}>
                            {tag}
                          </Tag>
                        ))}
                      </Flex>
                      <Center>  <Button
                      mt={4}
                      colorScheme="teal"
                      onClick={() => addToCart({
                        id: product.variants[0].id,
                        title: product.title,
                        price: product.variants[0].price.amount,
                      })}
                    >
                      Add to Cart
                    </Button> </Center>
                    </Box>
                 
                </Box>
              ))}
            </Grid>
            {showLoadMoreButton && (
              <Center>
                <Button mt={4} onClick={loadMore}>
                  Load More
                </Button>
              </Center>
            )}
          </Box>
        </Grid>
      </Box>
    </Center>
  );
};

export default ProductList;

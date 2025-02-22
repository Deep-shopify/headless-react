// src/components/Header.js

import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Link, Spacer, Button, useDisclosure, Collapse, Popover, PopoverTrigger, PopoverContent, PopoverBody, Portal, IconButton } from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons'; // Import AddIcon for cart
import { useNavigate } from 'react-router-dom';
import Client from 'shopify-buy';
import { FaShoppingCart } from 'react-icons/fa';

const client = Client.buildClient({
  domain: 'react-demo-store-2024.myshopify.com',
  storefrontAccessToken: '1b1f74c659da24e743c82345740c47f2', 
});

const Header = ({ cartItems, onOpenCart }) => {
  const { isOpen, onToggle } = useDisclosure();
  const { onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await client.collection.fetchAll(); // Fetch all collections
        setCollections(response);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };

    fetchCollections();
  }, []);

  return (
    <Box bg="teal.500" color="white" p={4}>
      <Flex alignItems="center">
        <Heading size="lg" cursor="pointer" onClick={() => navigate('/')}>
          My Shopify Store
        </Heading>
        <Spacer />
        <Button
          display={{ base: 'block', md: 'none' }}
          onClick={onToggle}
          variant="outline"
          colorScheme="whiteAlpha"
          leftIcon={<HamburgerIcon />}
        >
          Menu
        </Button>
        <Collapse in={isOpen} animateOpacity>
          <Box
            display={{ base: 'block', md: 'none' }}
            bg="teal.600"
            p={4}
            rounded="md"
            shadow="md"
          >
            <Popover placement="right-start" onOpen={onOpen} onClose={onClose}>
              <PopoverTrigger>
                <Link p={2} display="block">
                  Collections <ChevronDownIcon />
                </Link>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverBody>
                    {collections.map((collection) => (
                      <Link key={collection.id} onClick={() => navigate(`/collections/${collection.handle}`)} p={2} display="block">
                        {collection.title}
                      </Link>
                    ))}
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
        </Collapse>
        <Box display={{ base: 'none', md: 'flex' }} ml={10}>
          <Link p={4} onClick={() => navigate('/')}> 
            Home
          </Link>
          <Popover placement="bottom-start" onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
              <Link p={4}>
                Collections <ChevronDownIcon />
              </Link>
            </PopoverTrigger>
            <Portal>
              <PopoverContent>
                <PopoverBody>
                  {collections.map((collection) => (
                    <Link key={collection.id} onClick={() => navigate(`/collections/${collection.handle}`)} p={2} display="block">
                      {collection.title}
                    </Link>
                  ))}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
          <Link p={4} onClick={() => navigate('/otplogin')}> 
            OTP Login
          </Link>
        </Box>
        {/* Cart Icon Button */}
        <IconButton
          icon={<FaShoppingCart  />}
          aria-label="Open Cart"
          colorScheme="whiteAlpha"
          onClick={onOpenCart} // Call the function to open the cart drawer
          ml={4}
        />
      </Flex>
    </Box>
  );
};

export default Header;

// src/components/ProductPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Image, Center, Spinner, Button, useToast, Wrap, Flex } from '@chakra-ui/react';
import CartDrawer from '../components/Cart-drawer'; // Import the CartDrawer component

const ProductPage = ({ client, cartItems, addToCart, removeFromCart, updateQuantity, onCheckout }) => {
  const { id } = useParams(); // Get the numeric product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantId, setSelectedVariantId] = useState(null); // State for selected variant
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State to control the cart drawer
  const toast = useToast(); // Chakra UI toast for notifications

  useEffect(() => {
    const globalId = `gid://shopify/Product/${id}`; // Use the numeric ID to create the global ID

    console.log('Fetching product with ID:', globalId); // Log the global ID
    client.product.fetch(globalId) // Use the global ID to fetch the product
      .then((fetchedProduct) => {
        console.log('Fetched Product:', fetchedProduct); // Log the fetched product
        setProduct(fetchedProduct);
        setSelectedVariantId(fetchedProduct.variants[0].id); // Set the default selected variant
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
        setLoading(false);
      });
  }, [id, client]);

  const handleAddToCart = () => {
    if (!selectedVariantId) {
      toast({
        title: "Error",
        description: "Please select a variant before adding to cart.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const itemToAdd = {
      id: selectedVariantId,
      title: product.title,
      price: parseFloat(product.variants.find(v => v.id === selectedVariantId).price.amount),
    };

    addToCart(itemToAdd); // Use the addToCart function from props

    toast({
      title: "Added to Cart",
      description: `${product.title} has been added to your cart.`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
 
    // setTimeout(() => {
    //   setIsDrawerOpen(true); 
    // }, 4000);

  };

  const handleVariantChange = (variantId) => {
    setSelectedVariantId(variantId); // Update selected variant ID
  };

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!product) {
    return <Text>Product not found.</Text>;
  }

  return (
    <Center>
      <Flex maxW="1366px" w="full" p={4}>
      <Box width="50%">
        <Image src={product.images[0]?.src} alt={product.title} maxW="600px" />
        </Box>
        <Box width="50%">
        <Text fontWeight="bold" fontSize="2xl" mt={4}>{product.title}</Text>
        
        {/* Variant Selector as Buttons */}
        <Wrap spacing={4} mt={4}>
          {product.variants.map((variant) => (
            <Button
              key={variant.id}
              onClick={() => handleVariantChange(variant.id)}
              colorScheme={selectedVariantId === variant.id ? 'teal' : 'gray'}
              variant={selectedVariantId === variant.id ? 'solid' : 'outline'}
            >
              {variant.title} - ₹{variant.price.amount}
            </Button>
          ))}
        </Wrap>
        
        <Text fontSize="xl" mt={2}>Selected Price: ₹{product.variants.find(v => v.id === selectedVariantId)?.price.amount || '0.00'}</Text>
        <Text mt={4}>{product.description}</Text>
        
        <Button mt={4} colorScheme="teal" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Box>
        {/* Cart Drawer */}
        <CartDrawer 
          cartItems={cartItems} 
          onRemoveFromCart={removeFromCart} 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          onCheckout={onCheckout} // Pass the checkout handler
          updateQuantity={updateQuantity} // Pass the updateQuantity function
        />
      </Flex>
    </Center>
  );
};

export default ProductPage;

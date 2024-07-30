// src/components/ProductPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Text, Image, Center, Spinner, Button, useToast, Wrap } from '@chakra-ui/react';

const ProductPage = ({ client }) => {
  const { id } = useParams(); // Get the numeric product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutId, setCheckoutId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null); // State for selected variant
  const toast = useToast(); // Chakra UI toast for notifications

  useEffect(() => {
    // Construct the global ID format
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

    // Create a new checkout
    client.checkout.create()
      .then((checkout) => {
        setCheckoutId(checkout.id);
      })
      .catch((error) => {
        console.error('Error creating checkout:', error);
      });
  }, [id, client]);

  const addToCart = () => {
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

    client.checkout.addLineItems(checkoutId, [{ variantId: selectedVariantId, quantity: 1 }])
      .then((checkout) => {
        console.log('Added to cart:', checkout);
        toast({
          title: "Added to Cart",
          description: `${product.title} has been added to your cart.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        // Redirect to checkout
        window.location.href = checkout.webUrl; // Redirect to the checkout URL
      })
      .catch((error) => {
        console.error('Error adding to cart:', error);
        toast({
          title: "Error",
          description: "There was an error adding the item to your cart.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
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
      <Box maxW="600px" w="full" p={4}>
        <Image src={product.images[0]?.src} alt={product.title} maxW="600px" />
        <Text fontWeight="bold" fontSize="2xl" mt={4}>{product.title}</Text>
        
        {/* Variant Selector as Buttons */}
        <Wrap spacing={4} mt={4}>
          {product.variants.map((variant) => (
            <Button
              key={variant.id}
              onClick={() => handleVariantChange(variant.id)}
              colorScheme={selectedVariantId === variant.id ? 'teal' : 'gray'}
              variant={selectedVariantId === variant.id ? 'solid' : 'outline'}
              className={selectedVariantId === variant.id ? 'selected' : ''} // Add selected class
              style={{
                border: selectedVariantId === variant.id ? '2px solid #000' : '2px solid transparent',
                backgroundColor: selectedVariantId === variant.id ? '#000' : 'grey',
                color: selectedVariantId === variant.id ? '#fff' : '#fff',
              }}
            >
              {variant.title} - ${variant.price.amount}
            </Button>
          ))}
        </Wrap>
        
        <Text fontSize="xl" mt={2}>Selected Price: ${product.variants.find(v => v.id === selectedVariantId)?.price.amount || '0.00'}</Text>
        <Text mt={4}>{product.description}</Text>
        
        <Button mt={4} colorScheme="teal" onClick={addToCart}>
          Add to Cart
        </Button>
      </Box>
    </Center>
  );
};

export default ProductPage;

// src/components/CartDrawer.js

import React from 'react';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'; // Use DeleteIcon for remove action

const CartDrawer = ({ cartItems, onRemoveFromCart, isOpen, onClose, onCheckout, updateQuantity }) => {
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity; // Use item.quantity for total calculation
    }, 0);
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} w="100%">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Your Cart</DrawerHeader>

        <DrawerBody>
          {cartItems.length === 0 ? (
            <Text>Your cart is empty</Text>
          ) : (
            cartItems.map((item) => (
              <Flex key={item.id} justify="space-between" align="center" mb={4}>
                <Box>
                  <Text>{item.title}</Text>
                  <Text>₹{item.price} x {item.quantity}</Text> {/* Display quantity */}
                </Box>
                <Flex align="center">
                  <IconButton
                    aria-label="Decrease quantity"
                    icon={<Button>-</Button>}
                    onClick={() => updateQuantity(item.id, -1)}
                    isDisabled={item.quantity <= 1} // Disable if quantity is 1
                  />
                  <Text mx={2}>{item.quantity}</Text>
                  <IconButton
                    aria-label="Increase quantity"
                    icon={<Button>+</Button>}
                    onClick={() => updateQuantity(item.id, 1)}
                  />
                </Flex>
                <IconButton
                  aria-label="Remove item"
                  icon={<DeleteIcon />}
                  onClick={() => onRemoveFromCart(item.id)}
                  colorScheme="red"
                />
              </Flex>
            ))
          )}
        </DrawerBody>

        <Flex justify="space-between" align="center" p={4}>
          <Text fontWeight="bold">Total: ₹{getTotalPrice().toFixed(2)}</Text>
          <Button colorScheme="teal" onClick={onCheckout}>
            Checkout
          </Button>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;

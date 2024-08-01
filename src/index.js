// src/index.js or src/App.js

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Client from 'shopify-buy';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; 
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import CollectionsPage from './components/CollectionsPage';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header';
import CartDrawer from './components/Cart-drawer'; // Import the CartDrawer component
import './index.css';

// Initialize Shopify client
const client = Client.buildClient({
  domain: 'react-demo-store-2024.myshopify.com',
  storefrontAccessToken: '1b1f74c659da24e743c82345740c47f2',
});

const App = () => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

const addToCart = (item) => {
  const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
  if (existingItemIndex >= 0) {
    // Update quantity if item already exists
    const updatedCartItems = [...cartItems];
    updatedCartItems[existingItemIndex].quantity += 1; // Increment quantity
    setCartItems(updatedCartItems);
  } else {
    // Add new item to cart
    setCartItems((prevItems) => [...prevItems, { ...item, quantity: 1 }]);
  }
 
  setTimeout(() => {
    setIsDrawerOpen(true); 
  }, 1000);
};

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const handleCheckout = () => {
    const lineItems = cartItems.map(item => ({
      variantId: item.id,
      quantity: item.quantity,
    }));

    client.checkout.create({ lineItems })
      .then((checkout) => {
        window.location.href = checkout.webUrl;
      })
      .catch((error) => {
        console.error('Error during checkout:', error);
      });
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onOpenCart = () => {
    setIsDrawerOpen(true);
  };

  const onCloseCart = () => {
    setIsDrawerOpen(false);
  };

  return (
    <ChakraProvider>
      <Router>
        <Header cartItems={cartItems} onOpenCart={onOpenCart} />
        <CartDrawer 
          cartItems={cartItems} 
          onRemoveFromCart={removeFromCart} 
          isOpen={isDrawerOpen} 
          onClose={onCloseCart} 
          onCheckout={handleCheckout} 
        />
        <Routes>
          <Route path="/" element={<Home client={client} />} />
          <Route path="/collections" element={<CollectionsPage client={client} />} />
          <Route path="/collections/:handle" element={<ProductList client={client}  cartItems={cartItems} addToCart={addToCart}   removeFromCart={removeFromCart} />} />
          <Route
            path="/product/:id"
            element={
              <ProductPage
                client={client}
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                onCheckout={handleCheckout} // Pass the checkout handler
              />
            }
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

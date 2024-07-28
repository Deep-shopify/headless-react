import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import Client from 'shopify-buy';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import { Box, Flex, Text, Image } from '@chakra-ui/react';

const client = Client.buildClient({
  domain: 'react-demo-store-2024.myshopify.com',
  storefrontAccessToken: '1b1f74c659da24e743c82345740c47f2',
});

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
      <Routes>
        <Route path="/" element={<ProductList client={client} />} />
        <Route path="/product/:id" element={<ProductPage client={client} />} /> {/* Pass client to ProductPage */}
      </Routes>
    </Router>
);

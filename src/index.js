import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import App from './App';
import Client from 'shopify-buy';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home'; 
import ImageSlider from './components/homeslider';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage';
import CollectionsPage from './components/CollectionsPage';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header';
// In your main file (e.g., App.js or index.js)
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './index.css';

const client = Client.buildClient({
  domain: 'react-demo-store-2024.myshopify.com',
  storefrontAccessToken: '1b1f74c659da24e743c82345740c47f2',
});

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <ChakraProvider>
  <Router>
     <Header />
      <Routes>
      <Route path="/" element={<Home client={client} />} />
        <Route path="/collections" element={<CollectionsPage client={client} />} />
        <Route path="/collections/:handle" element={<ProductList client={client} />} />
        <Route path="/product/:id" element={<ProductPage client={client} />} /> {/* Pass client to ProductPage */}
      </Routes>
    </Router>
  </ChakraProvider> 
);

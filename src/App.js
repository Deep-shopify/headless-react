// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductPage from './components/ProductPage'; // Import the ProductPage component
import Client from 'shopify-buy'; // Import Shopify Buy SDK

const client = Client.buildClient({
  domain: 'your-shop-name.myshopify.com', // Replace with your actual Shopify store domain
  storefrontAccessToken: 'your-storefront-access-token', // Replace with your actual storefront access token
});

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProductList client={client} />} />
        <Route path="/product/:id" element={<ProductPage client={client} />} /> {/* Pass client to ProductPage */}
      </Routes>
    </Router>
  );
};

export default App;

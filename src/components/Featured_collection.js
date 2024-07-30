// ProductSlider.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductSlider = ({ collectionHandle }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log({collectionHandle});
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`https://react-demo-store-2024.myshopify.com/api/2023-10/graphql.json`, {
        headers: {
          'X-Shopify-Storefront-Access-Token': '1b1f74c659da24e743c82345740c47f2',
          'Content-Type': 'application/json',
        },
        data: {
          query: `
            {
              collection(handle: "${collectionHandle}") {
                products(first: 10) {
                  edges {
                    node {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            originalSrc
                            altText
                          }
                        }
                      }
                      variants(first: 1) {
                        edges {
                          node {
                            priceV2 {
                              amount
                              currencyCode
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          `,
        },
      });

      const productsData = response.data.data.collection.products.edges.map(edge => edge.node);
      setProducts(productsData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [collectionHandle]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching products: {error.message}</p>;

  return (
    <div className="product-slider">
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className="product-item">
            <h2>{product.title}</h2>
            {product.images.edges.length > 0 && (
              <img src={product.images.edges[0].node.originalSrc} alt={product.images.edges[0].node.altText} />
            )}
            <p>{product.variants.edges[0].node.priceV2.amount} {product.variants.edges[0].node.priceV2.currencyCode}</p>
            <a href={`/products/${product.handle}`}>View Product</a>
          </div>
        ))
      ) : (
        <p>No products found in this collection.</p>
      )}
    </div>
  );
};

export default ProductSlider;

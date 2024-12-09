import { json } from '@remix-run/node';
import { gql } from '@apollo/client';
import { shopifyClient } from '~/lib/shopifyClient'; // Ensure you have a configured Apollo client

export const loader = async () => {
    try {
        const response = await shopifyClient.query({
            query: gql`
                query {
                    products(first: 50) {
                        edges {
                            node {
                                id
                                title
                            }
                        }
                    }
                }
            `,
        });

        // Map the response to return only the necessary data
        const products = response.data.products.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
        }));

        return json({ products });
    } catch (error) {
        console.error("Error fetching products:", error);
        return json({ error: 'Failed to fetch products' }, { status: 500 });
    }
};
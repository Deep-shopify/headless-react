import { gql } from '@apollo/client';
import { shopifyClient } from '~/lib/shopifyClient'; // Ensure you have a configured Apollo client

export const createProductDiscount = async (discountData) => {
    const CREATE_DISCOUNT_MUTATION = gql`
        mutation CreateDiscount($input: DiscountInput!) {
            discountCodeCreate(input: $input) {
                userErrors {
                    field
                    message
                }
                discountCode {
                    id
                    code
                }
            }
        }
    `;

    // Prepare input with associated products
    const input = {
        code: discountData.code,
        value: discountData.amount,
        appliesTo: {
            products: discountData.productIds.map(id => ({ id })),
        },
        // Add other necessary fields like type, usage_limit, etc.
    };

    const { data } = await shopifyClient.mutate({
        mutation: CREATE_DISCOUNT_MUTATION,
        variables: { input },
    });

    return data.discountCodeCreate;
};
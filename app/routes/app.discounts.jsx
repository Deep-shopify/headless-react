import { useEffect, useState } from 'react';
import { Button, TextField, Card, Page, Select } from '@shopify/polaris';

const DiscountsPage = () => {
    const [code, setCode] = useState('');
    const [amount, setAmount] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Fetch products from Shopify API
    useEffect(() => {
        const fetchProducts = async () => {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data.products);
        };
        fetchProducts();
    }, []);

    const handleSubmit = async () => {
        const response = await fetch('/api/create-discount', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, amount, productIds: selectedProducts }),
        });

        const data = await response.json();
        if (data.errors) {
            console.error(data.errors);
        } else {
            console.log('Discount created:', data);
        }
    };

    // Handle selection changes
    const handleSelectChange = (value) => {
        setSelectedProducts(value); // Ensure this is an array
    };

    return (
        <Page title="Create Product-Wise Discount">
            <Card sectioned>
                <TextField 
                    label="Discount Code" 
                    value={code} 
                    onChange={setCode} 
                />
                <TextField 
                    label="Discount Amount" 
                    value={amount} 
                    onChange={setAmount} 
                />
                <Select
                    label="Select Products"
                    options={products.map(product => ({ label: product.title, value: product.id }))}
                    multiple={true}
                    onChange={handleSelectChange} // Use the handler here
                    value={selectedProducts} // This should be an array
                />
                <Button primary onClick={handleSubmit}>Create Discount</Button>
            </Card>
        </Page>
    );
};

export default DiscountsPage;
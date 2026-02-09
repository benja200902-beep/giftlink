const fs = require('fs');
const path = require('path');

// Product catalog (same as bot.js)
const PRODUCTS = [
    { name: '16,400 SkyBlock Gems', price: '99.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: '3,600 SkyBlock Gems', price: '24.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png' },
    { name: '11,000 Gold', price: '100.00', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/1ba5948d998c8120b97e3631568096f871f09e7d.png' },
    { name: 'VIP Rank', price: '6.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: 'VIP+ Rank', price: '14.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: 'MVP Rank', price: '29.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: 'MVP+ Rank', price: '44.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: 'MVP++ Rank', price: '7.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png' },
    { name: '1,000 Gold', price: '9.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png' },
    { name: '2,500 Gold', price: '25.00', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png' },
    { name: '5,000 Gold', price: '50.00', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png' },
    { name: '675 SkyBlock Gems', price: '4.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png' },
    { name: '1,390 SkyBlock Gems', price: '9.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png' },
    { name: '7,200 SkyBlock Gems', price: '49.99', image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png' }
];

// Function to format product name
function formatProductName(name) {
    if (name === 'MVP+ Rank') return 'mvpplus';
    if (name === 'MVP++ Rank') return 'mvpplusplus';
    if (name === 'VIP+ Rank') return 'vipplus';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Read the checkout template
const checkoutTemplate = fs.readFileSync('./gift/checkout.html', 'utf8');

PRODUCTS.forEach(product => {
    const productKey = formatProductName(product.name);
    const fileName = `${productKey}.html`;
    const filePath = path.join('./gift', fileName);
    
    // Create product-specific HTML by replacing the dynamic parts
    let productHTML = checkoutTemplate;
    
    // Replace the product data with specific product
    productHTML = productHTML.replace(
        "const product = ref(products[giftCode] || products[formatProductName('1,000 Gold')]);",
        `const product = ref({\n                        name: '${product.name}',\n                        image: '${product.image}',\n                        originalPrice: '$${product.price} USD',\n                        finalPrice: '$0.00 USD'\n                    });`
    );
    
    // Remove debug logs
    productHTML = productHTML.replace(
        "console.log('Gift code:', giftCode);\n                console.log('Available products:', Object.keys(products));\n                console.log('Selected product:', products[giftCode]);",
        `console.log('Product: ${product.name}');`
    );
    
    // Write the file
    fs.writeFileSync(filePath, productHTML);
    console.log(`Created: ${fileName}`);
});

console.log('All product pages created successfully!');

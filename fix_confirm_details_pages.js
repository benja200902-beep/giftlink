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

PRODUCTS.forEach(product => {
    const productKey = formatProductName(product.name);
    const fileName = `${productKey}-confirm.html`;
    const filePath = path.join('./gift', fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace product data in the Vue component
        const oldProductData = `name: '1,000 Gold',

                price: 9.99,

                image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png'`;
        
        const newProductData = `name: '${product.name}',

                price: ${product.price},

                image: '${product.image}'`;
        
        content = content.replace(oldProductData, newProductData);
        
        // Replace any remaining instances of the old product name
        content = content.replace(/1,000 Gold/g, product.name);
        content = content.replace(/\$9\.99/g, `$${product.price}`);
        
        // Replace the alt text
        content = content.replace(/:alt="product\?\..*?"|:alt=".*?1,000 Gold.*?"/g, `:alt="product?.name || '${product.name}'"`);
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All confirm details pages fixed!');

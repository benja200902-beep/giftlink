const fs = require('fs');
const path = require('path');

// Real product images from checkout.html
const PRODUCT_IMAGES = {
    '16,400 SkyBlock Gems': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    '3,600 SkyBlock Gems': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
    '11,000 Gold': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/1ba5948d998c8120b97e3631568096f871f09e7d.png',
    'VIP Rank': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    'VIP+ Rank': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    'MVP Rank': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    'MVP+ Rank': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    'MVP++ Rank': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
    '1,000 Gold': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
    '2,500 Gold': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
    '5,000 Gold': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
    '675 SkyBlock Gems': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
    '1,390 SkyBlock Gems': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
    '7,200 SkyBlock Gems': 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png'
};

// Function to format product name
function formatProductName(name) {
    if (name === 'MVP+ Rank') return 'mvpplus';
    if (name === 'MVP++ Rank') return 'mvpplusplus';
    if (name === 'VIP+ Rank') return 'vipplus';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

Object.entries(PRODUCT_IMAGES).forEach(([productName, imageUrl]) => {
    const productKey = formatProductName(productName);
    const fileName = `${productKey}-confirm.html`;
    const filePath = path.join('./gift', fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update the product object with correct image
        const oldProductObject = `const product = ref({
                    name: '${productName}',
                    price: '10.00',
                    image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png'
                });`;
        
        const newProductObject = `const product = ref({
                    name: '${productName}',
                    price: '${productName.includes('Gold') ? '9.99' : productName.includes('VIP') ? '14.99' : productName.includes('MVP+') ? '44.99' : productName.includes('MVP++') ? '7.99' : productName.includes('MVP') ? '29.99' : productName.includes('VIP') ? '6.99' : '99.99'}',
                    image: '${imageUrl}'
                });`;
        
        content = content.replace(oldProductObject, newProductObject);
        
        // Also update the default image in the template
        content = content.replace(
            "https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png",
            imageUrl
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated image for ${productName} in ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All product images updated with real images!');

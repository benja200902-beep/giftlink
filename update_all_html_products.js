const fs = require('fs');
const path = require('path');

// Product mapping with correct images and prices
const pageProducts = {
    'vip-rank': {
        name: 'VIP Rank',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$6.99 USD',
        finalPrice: '$0.00 USD'
    },
    'mvp-rank': {
        name: 'MVP Rank',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$29.99 USD',
        finalPrice: '$0.00 USD'
    },
    'mvpplus': {
        name: 'MVP+ Rank',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$44.99 USD',
        finalPrice: '$0.00 USD'
    },
    'mvpplusplus': {
        name: 'MVP++ Rank',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$7.99 USD',
        finalPrice: '$0.00 USD'
    },
    'vipplus': {
        name: 'VIP+ Rank',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$14.99 USD',
        finalPrice: '$0.00 USD'
    },
    '1-000-gold': {
        name: '1,000 Gold',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
        originalPrice: '$9.99 USD',
        finalPrice: '$0.00 USD'
    },
    '2-500-gold': {
        name: '2,500 Gold',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
        originalPrice: '$25.00 USD',
        finalPrice: '$0.00 USD'
    },
    '5-000-gold': {
        name: '5,000 Gold',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/c6e8cde2a5a147fd6d6e9b7506a62fab195e09e0.png',
        originalPrice: '$50.00 USD',
        finalPrice: '$0.00 USD'
    },
    '11-000-gold': {
        name: '11,000 Gold',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/1ba5948d998c8120b97e3631568096f871f09e7d.png',
        originalPrice: '$100.00 USD',
        finalPrice: '$0.00 USD'
    },
    '1-390-skyblock-gems': {
        name: '1,390 SkyBlock Gems',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
        originalPrice: '$9.99 USD',
        finalPrice: '$0.00 USD'
    },
    '3-600-skyblock-gems': {
        name: '3,600 SkyBlock Gems',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
        originalPrice: '$24.99 USD',
        finalPrice: '$0.00 USD'
    },
    '16-400-skyblock-gems': {
        name: '16,400 SkyBlock Gems',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/f7c6103a133d1fd12fe4ade63694556d35c52055.png',
        originalPrice: '$99.99 USD',
        finalPrice: '$0.00 USD'
    },
    '675-skyblock-gems': {
        name: '675 SkyBlock Gems',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
        originalPrice: '$4.99 USD',
        finalPrice: '$0.00 USD'
    },
    '7-200-skyblock-gems': {
        name: '7,200 SkyBlock Gems',
        image: 'https://dunb17ur4ymx4.cloudfront.net/packages/images/595f2e53789958dbf6d88e816ae9d94df62a640b.png',
        originalPrice: '$49.99 USD',
        finalPrice: '$0.00 USD'
    }
};

// Convert pageProducts to JavaScript string
const pageProductsString = JSON.stringify(pageProducts, null, 4)
    .replace(/"/g, "'")
    .replace(/'/g, '"');

// Function to update HTML file
function updateHtmlFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the hardcoded product section with dynamic product mapping
        const oldProductSection = /\/\/ Debug: log products and gift code[\s\S]*?const product = ref\({[\s\S]*?}\);/;
        
        const newProductSection = `// Get product based on current page filename
                const currentPath = window.location.pathname;
                const pageName = currentPath.split('/').pop().replace('.html', '');
                
                // Product mapping based on page name
                const pageProducts = ${pageProductsString};
                
                // Get current product or default to VIP Rank
                const currentProduct = pageProducts[pageName] || pageProducts['vip-rank'];
                
                const product = ref(currentProduct);`;
        
        content = content.replace(oldProductSection, newProductSection);
        
        // Update applyGift function to use pageName
        const oldApplyGift = /const applyGift = \(\) => \{[\s\S]*?\};/;
        const newApplyGift = `const applyGift = () => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const giftCode = urlParams.get('gift') || pageName + '-default1234567890abcdef';
                    window.location.href = 'https://tebex.lat/checkout?gift=' + giftCode;
                };`;
        
        content = content.replace(oldApplyGift, newApplyGift);
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${path.basename(filePath)}`);
        return true;
    } catch (error) {
        console.error(`Error updating ${filePath}:`, error.message);
        return false;
    }
}

// Get all HTML files in the gift directory
const giftDir = path.join(__dirname, 'gift');
const htmlFiles = fs.readdirSync(giftDir).filter(file => file.endsWith('.html'));

console.log('Updating HTML files with dynamic product mapping...');

let successCount = 0;
htmlFiles.forEach(file => {
    const filePath = path.join(giftDir, file);
    if (updateHtmlFile(filePath)) {
        successCount++;
    }
});

console.log(`\nCompleted: ${successCount}/${htmlFiles.length} files updated successfully.`);

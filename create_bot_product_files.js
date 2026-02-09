const fs = require('fs');
const path = require('path');

// Product mappings from bot.js format to our files
const botProductMappings = {
    'mvp-rank': {
        sourceFile: 'mvp-rank.html',
        targetFile: 'mvp-rank.html',
        productName: 'MVP Rank'
    },
    'vip-rank': {
        sourceFile: 'vip-rank.html', 
        targetFile: 'vip-rank.html',
        productName: 'VIP Rank'
    }
    // Note: MVP+ and VIP+ both generate 'mvp-rank' and 'vip-rank' in bot.js
    // This is the issue - they need unique names
};

// Read bot.js to see actual format
const botContent = fs.readFileSync('./bot.js', 'utf8');
const productMatch = botContent.match(/const PRODUCTS = \[([\s\S]*?)\];/);
if (productMatch) {
    console.log('Bot.js products format detected');
    console.log('The issue: MVP+ Rank and VIP+ Rank both format to same names as MVP Rank and VIP Rank');
    console.log('Need to fix bot.js formatProductName function or create unique mappings');
}

// Create symbolic links or copies for the conflicting products
const conflictingProducts = [
    { botName: 'mvp-rank', actualProduct: 'MVP+ Rank', sourceFile: 'mvpplus.html' },
    { botName: 'vip-rank', actualProduct: 'VIP+ Rank', sourceFile: 'vipplus.html' },
    { botName: 'mvp-rank', actualProduct: 'MVP++ Rank', sourceFile: 'mvpplusplus.html' }
];

conflictingProducts.forEach(({ botName, actualProduct, sourceFile }) => {
    const targetFile = `${botName}-${actualProduct.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    const sourcePath = path.join('./gift', sourceFile);
    const targetPath = path.join('./gift', targetFile);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
        console.log(`Created: ${targetFile} for ${actualProduct}`);
    }
});

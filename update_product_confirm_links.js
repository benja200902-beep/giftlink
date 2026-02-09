const fs = require('fs');
const path = require('path');

// Product files that need updating with their corresponding confirm pages
const productConfirmMappings = {
    '16-400-skyblock-gems.html': '16-400-skyblock-gems-confirm.html',
    '3-600-skyblock-gems.html': '3-600-skyblock-gems-confirm.html',
    '11-000-gold.html': '11-000-gold-confirm.html',
    'vip-rank.html': 'vip-rank-confirm.html',
    'vipplus.html': 'vipplus-confirm.html',
    'mvp-rank.html': 'mvp-rank-confirm.html',
    'mvpplus.html': 'mvpplus-confirm.html',
    'mvpplusplus.html': 'mvpplusplus-confirm.html',
    '1-000-gold.html': '1-000-gold-confirm.html',
    '2-500-gold.html': '2-500-gold-confirm.html',
    '5-000-gold.html': '5-000-gold-confirm.html',
    '675-skyblock-gems.html': '675-skyblock-gems-confirm.html',
    '1-390-skyblock-gems.html': '1-390-skyblock-gems-confirm.html',
    '7-200-skyblock-gems.html': '7-200-skyblock-gems-confirm.html'
};

Object.entries(productConfirmMappings).forEach(([productFile, confirmFile]) => {
    const filePath = path.join('./gift', productFile);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Update the applyGift function to redirect to specific confirm page
        content = content.replace(
            "window.location.href = '../confirm_details.html';",
            `window.location.href = '../${confirmFile}';`
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${productFile} -> ${confirmFile}`);
    } else {
        console.log(`File not found: ${productFile}`);
    }
});

console.log('All product pages updated with specific confirm links!');

const fs = require('fs');
const path = require('path');

// Product files that need updating
const productFiles = [
    '16-400-skyblock-gems.html',
    '3-600-skyblock-gems.html',
    '11-000-gold.html',
    'vip-rank.html',
    'vipplus.html',
    'mvp-rank.html',
    'mvpplus.html',
    'mvpplusplus.html',
    '1-000-gold.html',
    '2-500-gold.html',
    '5-000-gold.html',
    '675-skyblock-gems.html',
    '1-390-skyblock-gems.html',
    '7-200-skyblock-gems.html'
];

productFiles.forEach(fileName => {
    const filePath = path.join('./gift', fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace the applyGift function with correct path
        content = content.replace(
            "window.location.href = 'confirm_details.html';",
            "window.location.href = '../confirm_details.html';"
        );
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated path in: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All product pages updated with correct path!');

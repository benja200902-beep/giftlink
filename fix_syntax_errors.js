const fs = require('fs');
const path = require('path');

// Product files that need syntax fixing
const confirmFiles = [
    '16-400-skyblock-gems-confirm.html',
    '3-600-skyblock-gems-confirm.html',
    '11-000-gold-confirm.html',
    'vip-rank-confirm.html',
    'vipplus-confirm.html',
    'mvp-rank-confirm.html',
    'mvpplus-confirm.html',
    'mvpplusplus-confirm.html',
    '1-000-gold-confirm.html',
    '2-500-gold-confirm.html',
    '5-000-gold-confirm.html',
    '675-skyblock-gems-confirm.html',
    '1-390-skyblock-gems-confirm.html',
    '7-200-skyblock-gems-confirm.html'
];

confirmFiles.forEach(fileName => {
    const filePath = path.join('./gift', fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix the return object syntax - remove the malformed section
        const brokenSection = /product\s*\n\s*\n\s*\n\s*email,/;
        const fixedSection = `product,\n\n                    // Form data\n                    email,`;
        
        content = content.replace(brokenSection, fixedSection);
        
        // Also fix any other syntax issues in the return object
        content = content.replace(/,\s*\n\s*\n\s*([a-zA-Z])/g, ',\n                    $1');
        
        fs.writeFileSync(filePath, content);
        console.log(`Fixed syntax in: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All syntax errors fixed!');

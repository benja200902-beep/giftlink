const fs = require('fs');
const path = require('path');

// Product files that need external resource removal
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
        
        // Remove external CSS and JS references that are causing 404 errors
        content = content.replace(/<link[^>]*href=["']https:\/\/hypixelgift\.com\/security\/print-shield\.css["'][^>]*>/g, '');
        content = content.replace(/<script[^>]*src=["']https:\/\/hypixelgift\.com\/security\/anti-copy\.js["'][^>]*><\/script>/g, '');
        
        fs.writeFileSync(filePath, content);
        console.log(`Removed external resources from: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All external resources removed!');

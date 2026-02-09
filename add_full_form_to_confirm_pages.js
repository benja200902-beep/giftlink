const fs = require('fs');
const path = require('path');

// Product files that need the full form
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

// The full form HTML to add
const fullFormHTML = `
                    <!-- Full Redemption Form -->
                    <div class="redemption-form">
                        <div class="form-section">
                            <label class="tebex-label">Email Address</label>
                            <v-text-field 
                                placeholder="Enter your email address" 
                                variant="outlined" 
                                density="compact" 
                                bg-color="#FAFAFA" 
                                hide-details
                                v-model="email"
                                :rules="emailRules"
                                class="mb-4">
                            </v-text-field>
                            
                            <label class="tebex-label">Full Name</label>
                            <v-text-field 
                                placeholder="Enter your full name" 
                                variant="outlined" 
                                density="compact" 
                                bg-color="#FAFAFA" 
                                hide-details
                                v-model="fullName"
                                :rules="nameRules"
                                class="mb-4">
                            </v-text-field>
                            
                            <label class="tebex-label">Zip/Postal Code</label>
                            <v-text-field 
                                placeholder="Enter your zip/postal code" 
                                variant="outlined" 
                                density="compact" 
                                bg-color="#FAFAFA" 
                                hide-details
                                v-model="zipCode"
                                :rules="zipRules"
                                class="mb-4">
                            </v-text-field>
                            
                            <v-checkbox 
                                v-model="acceptTerms"
                                :rules="termsRules"
                                class="mb-4">
                                <template v-slot:label>
                                    <span class="terms-label">
                                        I accept the <a href="#" class="terms-link">Terms and Conditions</a>
                                    </span>
                                </template>
                            </v-checkbox>
                            
                            <v-btn 
                                color="primary"
                                size="large"
                                class="complete-btn"
                                :loading="isSubmitting"
                                :disabled="!isFormValid"
                                @click="completeRedemption"
                                block>
                                Complete Redemption
                            </v-btn>
                        </div>
                    </div>
`;

// Vue data and methods to add
const vueData = `
                // Form data
                const email = ref('');
                const fullName = ref('');
                const zipCode = ref('');
                const acceptTerms = ref(false);
                
                // Validation rules
                const emailRules = [
                    v => !!v || 'Email is required',
                    v => /.+@.+\..+/.test(v) || 'Email must be valid'
                ];
                
                const nameRules = [
                    v => !!v || 'Full name is required',
                    v => v.length >= 2 || 'Name must be at least 2 characters'
                ];
                
                const zipRules = [
                    v => !!v || 'Zip/Postal code is required',
                    v => /^[0-9]{5}(-[0-9]{4})?$/.test(v) || 'Invalid zip code format'
                ];
                
                const termsRules = [
                    v => !!v || 'You must accept the terms and conditions'
                ];
                
                // Computed
                const isFormValid = computed(() => {
                    return email.value && 
                           fullName.value && 
                           zipCode.value && 
                           acceptTerms.value &&
                           emailRules.every(rule => rule(email.value) === true) &&
                           nameRules.every(rule => rule(fullName.value) === true) &&
                           zipRules.every(rule => rule(zipCode.value) === true);
                });
                
                // Methods
                const completeRedemption = async () => {
                    if (!isFormValid.value || isSubmitting.value) return;
                    
                    isSubmitting.value = true;
                    errorMessage.value = '';
                    
                    try {
                        // Simulate API call
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        // Success - redirect to success page
                        window.location.href = 'success.html';
                    } catch (error) {
                        errorMessage.value = 'Failed to complete redemption. Please try again.';
                    } finally {
                        isSubmitting.value = false;
                    }
                };
`;

confirmFiles.forEach(fileName => {
    const filePath = path.join('./gift', fileName);
    
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Add Vue data before the return statement
        const returnIndex = content.indexOf('return {');
        if (returnIndex !== -1) {
            content = content.slice(0, returnIndex) + vueData + '\n                ' + content.slice(returnIndex);
        }
        
        // Add form data to the return object
        const returnObjMatch = content.match(/return \{([\s\S]*?)\};/);
        if (returnObjMatch) {
            const currentReturn = returnObjMatch[1];
            const newReturn = currentReturn + `
                    email,
                    fullName,
                    zipCode,
                    acceptTerms,
                    emailRules,
                    nameRules,
                    zipRules,
                    termsRules,
                    isFormValid,
                    completeRedemption,`;
            
            content = content.replace(returnObjMatch[0], `return {${newReturn}\n                };`);
        }
        
        // Add the form HTML after the verification section
        const verificationEndIndex = content.indexOf('</div>');
        if (verificationEndIndex !== -1) {
            const nextDivIndex = content.indexOf('</div>', verificationEndIndex + 1);
            if (nextDivIndex !== -1) {
                content = content.slice(0, nextDivIndex + 6) + fullFormHTML + content.slice(nextDivIndex + 6);
            }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Added full form to: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All confirm pages updated with full redemption form!');

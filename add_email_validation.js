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
        
        // Replace the static email input with Vue component
        const oldEmailInput = `<div class="mb-4">
                                <label class="section-title">Email Address</label>
                                <div class="v-input v-input--horizontal v-input--center-affix v-input--density-compact v-locale--is-ltr v-text-field">
                                    <div class="v-input__control">
                                        <div class="v-field v-field--center-affix v-field--no-label v-field--variant-outlined v-theme--light v-locale--is-ltr">
                                            <div class="v-field__overlay"></div>
                                            <div class="v-field__loader"></div>
                                            <div class="v-field__field" data-no-activator="">
                                                <input placeholder="Enter your email address" size="1" type="email" class="v-field__input" value="">
                                            </div>
                                            <div class="v-field__outline">
                                                <div class="v-field__outline__start"></div>
                                                <div class="v-field__outline__end"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
        
        const newEmailInput = `<div class="mb-4">
                                <label class="section-title">Email Address</label>
                                <v-text-field
                                    v-model="email"
                                    placeholder="Enter your email address"
                                    type="email"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="showErrors && !isValidEmail(email) ? 'Please enter a valid email address' : ''"
                                    :error="showErrors && !isValidEmail(email)"
                                ></v-text-field>
                            </div>`;
        
        content = content.replace(oldEmailInput, newEmailInput);
        
        // Replace the static name input with Vue component
        const oldNameInput = `<div>
                                    <label class="section-title">Full Name</label>
                                    <div class="v-input v-input--horizontal v-input--center-affix v-input--density-compact v-locale--is-ltr v-text-field">
                                        <div class="v-input__control">
                                            <div class="v-field v-field--center-affix v-field--no-label v-field--variant-outlined v-theme--light v-locale--is-ltr">
                                                <div class="v-field__overlay"></div>
                                                <div class="v-field__loader"></div>
                                                <div class="v-field__field" data-no-activator="">
                                                    <input placeholder="Enter your full name" size="1" type="text" class="v-field__input" value="">
                                                </div>
                                                <div class="v-field__outline">
                                                    <div class="v-field__outline__start"></div>
                                                    <div class="v-field__outline__end"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        
        const newNameInput = `<div>
                                    <label class="section-title">Full Name</label>
                                    <v-text-field
                                        v-model="fullName"
                                        placeholder="Enter your full name"
                                        type="text"
                                        variant="outlined"
                                        density="compact"
                                        :error-messages="showErrors && !fullName ? 'Full name is required' : ''"
                                        :error="showErrors && !fullName"
                                    ></v-text-field>
                                </div>`;
        
        content = content.replace(oldNameInput, newNameInput);
        
        // Replace the static postal input with Vue component
        const oldPostalInput = `<div>
                                    <label class="section-title">Zip / Postal Code</label>
                                    <div class="v-input v-input--horizontal v-input--center-affix v-input--density-compact v-locale--is-ltr v-text-field">
                                        <div class="v-input__control">
                                            <div class="v-field v-field--center-affix v-field--no-label v-field--variant-outlined v-theme--light v-locale--is-ltr">
                                                <div class="v-field__overlay"></div>
                                                <div class="v-field__loader"></div>
                                                <div class="v-field__field" data-no-activator="">
                                                    <input placeholder="PO12 1AB" size="1" type="text" class="v-field__input" value="">
                                                </div>
                                                <div class="v-field__outline">
                                                    <div class="v-field__outline__start"></div>
                                                    <div class="v-field__outline__end"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
        
        const newPostalInput = `<div>
                                    <label class="section-title">Zip / Postal Code</label>
                                    <v-text-field
                                        v-model="postalCode"
                                        placeholder="PO12 1AB"
                                        type="text"
                                        variant="outlined"
                                        density="compact"
                                        :error-messages="showErrors && !postalCode ? 'Postal code is required' : ''"
                                        :error="showErrors && !postalCode"
                                    ></v-text-field>
                                </div>`;
        
        content = content.replace(oldPostalInput, newPostalInput);
        
        // Replace the static checkboxes with Vue components
        const oldUpdatesCheckbox = `<div class="checkbox-row mt-4">
                                <input type="checkbox" id="updates">
                                <label for="updates">Allow Hypixel Store & Tebex to send me updates & announcements via email.</label>
                            </div>`;
        
        const newUpdatesCheckbox = `<div class="checkbox-row mt-4">
                                <v-checkbox v-model="allowUpdates" label="Allow Hypixel Store & Tebex to send me updates & announcements via email."></v-checkbox>
                            </div>`;
        
        content = content.replace(oldUpdatesCheckbox, newUpdatesCheckbox);
        
        const oldTermsCheckbox = `<div class="checkbox-row">
                                <input type="checkbox" id="terms">
                                <label for="terms">
                                    I agree to Tebex's <a href="https://checkout.tebex.io/terms" target="_blank">Terms</a> & 
                                    <a href="https://checkout.tebex.io/privacy" target="_blank">Privacy Policy</a> as the seller and merchant of record.
                                </label>
                            </div>`;
        
        const newTermsCheckbox = `<div class="checkbox-row">
                                <v-checkbox 
                                    v-model="agreeTerms" 
                                    :error-messages="showErrors && !agreeTerms ? 'You must agree to the terms and conditions' : ''"
                                    :error="showErrors && !agreeTerms"
                                >
                                    <template v-slot:label>
                                        I agree to Tebex's <a href="https://checkout.tebex.io/terms" target="_blank">Terms</a> & 
                                        <a href="https://checkout.tebex.io/privacy" target="_blank">Privacy Policy</a> as the seller and merchant of record.
                                    </template>
                                </v-checkbox>
                            </div>`;
        
        content = content.replace(oldTermsCheckbox, newTermsCheckbox);
        
        // Replace the static button with Vue button
        const oldButton = `<div class="mt-2 mb-8">
                                <button type="button" class="v-btn v-btn--elevated v-theme--light v-btn--density-default elevation-0 v-btn--size-default v-btn--variant-elevated pay-btn" style="height: 48px;">
                                    <span class="v-btn__overlay"></span>
                                    <span class="v-btn__underlay"></span>
                                    <span class="v-btn__content" data-no-activator="">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                                            <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"></path>
                                        </svg>
                                        Complete Redemption
                                    </span>
                                </button>
                            </div>`;
        
        const newButton = `<div class="mt-2 mb-8">
                                <v-btn 
                                    color="primary"
                                    size="large"
                                    class="pay-btn"
                                    :loading="isPageLoading"
                                    @click="validate"
                                    block
                                >
                                    <v-icon style="margin-right: 8px;">mdi-gift</v-icon>
                                    Complete Redemption
                                </v-btn>
                            </div>`;
        
        content = content.replace(oldButton, newButton);
        
        fs.writeFileSync(filePath, content);
        console.log(`Added Vue validation to: ${fileName}`);
    } else {
        console.log(`File not found: ${fileName}`);
    }
});

console.log('All confirm pages updated with Vue validation!');

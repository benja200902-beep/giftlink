const express = require('express');
const ClaimsSystem = require('./claims_system');

const router = express.Router();
const claimsSystem = new ClaimsSystem();

// Clean up expired claims every hour
setInterval(() => {
    claimsSystem.cleanupExpiredClaims();
}, 60 * 60 * 1000);

// POST /api/claims/claim - Claim an account by full name
router.post('/claim', async (req, res) => {
    try {
        const { fullName, userId } = req.body;
        
        if (!fullName || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Full name and user ID are required' 
            });
        }

        const result = await claimsSystem.claimAccount(fullName, userId);
        
        if (result.success) {
            res.json({
                success: true,
                message: 'Account claimed successfully',
                account: result.account
            });
        } else {
            res.status(400).json(result);
        }
        
    } catch (error) {
        console.error('Error in /claim:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/claims/available - Get available claims
router.get('/available', async (req, res) => {
    try {
        const claims = await claimsSystem.getAvailableClaims();
        res.json({
            success: true,
            claims: claims
        });
    } catch (error) {
        console.error('Error in /available:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// GET /api/claims/user/:userId - Get user's claimed accounts
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const claims = await claimsSystem.getUserClaims(userId);
        res.json({
            success: true,
            claims: claims
        });
    } catch (error) {
        console.error('Error in /user/:userId:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

module.exports = router;

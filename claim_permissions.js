// Claim Permissions System - Manage who can claim accounts

const { queryParams } = require('./autosecure/db/database');
const { hasAccess } = require('./autosecure/utils/info/hasAccess');

class ClaimPermissions {
    constructor() {
        this.cache = new Map(); // Cache for permissions
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    }

    // Check if a user has permission to claim
    async canClaim(userId) {
        try {
            // Check cache first
            const cached = this.cache.get(userId);
            if (cached && (Date.now() - cached.timestamp) < this.cacheTimeout) {
                return cached.hasPermission;
            }

            // Check database
            const permissions = await queryParams(`
                SELECT has_permission FROM claim_permissions 
                WHERE user_id = ? AND has_permission = 1
            `, [userId]);

            const hasPermission = permissions.length > 0;

            // Update cache
            this.cache.set(userId, {
                hasPermission,
                timestamp: Date.now()
            });

            return hasPermission;
        } catch (error) {
            console.error('Error checking claim permission:', error);
            return false;
        }
    }

    // Grant claim permission to a user
    async grantPermission(ownerId, targetUserId) {
        try {
            // Check if owner has permission to manage
            if (!await hasAccess(ownerId)) {
                return { success: false, error: 'You do not have permission to manage claim permissions' };
            }

            // Add or update permission
            await queryParams(`
                INSERT OR REPLACE INTO claim_permissions (user_id, has_permission, granted_by, granted_at)
                VALUES (?, 1, ?, datetime('now'))
            `, [targetUserId, ownerId]);

            // Clear cache for this user
            this.cache.delete(targetUserId);

            return { success: true, message: 'Claim permission granted successfully' };
        } catch (error) {
            console.error('Error granting claim permission:', error);
            return { success: false, error: 'Failed to grant permission' };
        }
    }

    // Revoke claim permission from a user
    async revokePermission(ownerId, targetUserId) {
        try {
            // Check if owner has permission to manage
            if (!await hasAccess(ownerId)) {
                return { success: false, error: 'You do not have permission to manage claim permissions' };
            }

            // Remove permission
            await queryParams(`
                DELETE FROM claim_permissions 
                WHERE user_id = ?
            `, [targetUserId]);

            // Clear cache for this user
            this.cache.delete(targetUserId);

            return { success: true, message: 'Claim permission revoked successfully' };
        } catch (error) {
            console.error('Error revoking claim permission:', error);
            return { success: false, error: 'Failed to revoke permission' };
        }
    }

    // List all users with claim permissions
    async listPermissions(ownerId) {
        try {
            // Check if owner has permission to manage
            if (!await hasAccess(ownerId)) {
                return { success: false, error: 'You do not have permission to view claim permissions' };
            }

            const permissions = await queryParams(`
                SELECT user_id, granted_by, granted_at 
                FROM claim_permissions 
                WHERE has_permission = 1
                ORDER BY granted_at DESC
            `);

            return { success: true, permissions: permissions };
        } catch (error) {
            console.error('Error listing claim permissions:', error);
            return { success: false, error: 'Failed to list permissions' };
        }
    }

    // Get user's claim permissions
    async getUserPermissions(userId) {
        try {
            const permissions = await queryParams(`
                SELECT user_id, granted_by, granted_at, has_permission
                FROM claim_permissions 
                WHERE user_id = ?
            `, [userId]);

            return { success: true, permissions: permissions };
        } catch (error) {
            console.error('Error getting user permissions:', error);
            return { success: false, error: 'Failed to get permissions' };
        }
    }

    // Initialize database table
    async initializeTable() {
        try {
            await queryParams(`
                CREATE TABLE IF NOT EXISTS claim_permissions (
                    user_id TEXT PRIMARY KEY,
                    has_permission INTEGER DEFAULT 0,
                    granted_by TEXT,
                    granted_at TEXT,
                    created_at TEXT DEFAULT datetime('now')
                )
            `);
            console.log('Claim permissions table initialized');
        } catch (error) {
            console.error('Error initializing claim permissions table:', error);
        }
    }

    // Clear expired cache entries
    cleanupCache() {
        const now = Date.now();
        for (const [userId, cached] of this.cache.entries()) {
            if (now - cached.timestamp > this.cacheTimeout) {
                this.cache.delete(userId);
            }
        }
    }
}

module.exports = ClaimPermissions;

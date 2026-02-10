const axios = require("axios");

module.exports = async (email) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            data: {
                id: Math.random().toString(36).substring(2, 15),
                email: email,
                hasOtp: true
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = async (data, profiles) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return {
            cookies: "mock_cookies_" + Math.random().toString(36),
            token: "mock_token_" + Math.random().toString(36),
            success: true
        };
    } catch (error) {
        return null;
    }
};

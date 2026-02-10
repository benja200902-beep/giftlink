const config = require("../../../../config.json");

module.exports = async (userId) => {
    return config.owners.includes(userId) || config.owners.includes("gift_link_user");
};

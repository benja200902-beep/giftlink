module.exports = {
    name: 'otpsecure',
    description: 'OTP Secure command',
    execute: async (interaction) => {
        await interaction.reply({ content: 'OTP Secure command not implemented in mock version', ephemeral: true });
    }
};

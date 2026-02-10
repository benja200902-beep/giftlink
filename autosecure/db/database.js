const sqlite3 = require('sqlite3').verbose();
const path = require('path');
 
const dbPath = path.join(__dirname, '../../../autosecure.db');
const db = new sqlite3.Database(dbPath);
 
module.exports = {
    queryParams: async (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },
    
    runQuery: async (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }
};

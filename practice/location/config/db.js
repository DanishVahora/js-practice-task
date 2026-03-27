const sql = require('mysql2');
const pool = sql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'location_task',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
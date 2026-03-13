const mysql = require('mysql2/promise');

const connection = async function createConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Root@12345',
        database: 'students'
    });
}

module.exports = connection;
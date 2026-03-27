const sql = require("mysql2");
let pool;
try {
  pool = sql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "student_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
} catch {
  console.log("Error while connecting to db!!");
}

const poolPromise = pool.promise();

module.exports = poolPromise;

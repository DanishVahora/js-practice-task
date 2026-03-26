const sql = require("mysql2");
let pool;
try {
  pool = sql.createPool({
    host: "localhost",
    user: "root",
    password: "Root@1234",
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

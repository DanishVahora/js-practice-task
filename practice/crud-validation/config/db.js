const sql = require("mysql2")

const pool = sql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "student_db",
    queueLimit:0,
    connectionLimit:15
})

module.exports=pool.promise();

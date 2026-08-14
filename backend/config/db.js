const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "form2feature",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testDatabase() {
    try {
        const connection = await pool.getConnection();

        console.log("✅ MySQL Database Connected");

        connection.release();
    } catch (error) {
        console.error("❌ MySQL Connection Failed:", error.message);
    }
}

module.exports = {
    pool,
    testDatabase
};
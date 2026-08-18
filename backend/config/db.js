const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "form2feature",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const testDatabase = async () => {

    try {

        const connection =
            await pool.getConnection();

        console.log(
            "✅ MySQL Database Connected"
        );

        await connection.query(
            "SELECT 1"
        );

        connection.release();

        console.log(
            "✅ Database test completed"
        );

    } catch (error) {

        console.error(
            "❌ Database test failed:",
            error.message
        );

    }

};


module.exports = {
    pool,
    testDatabase
};
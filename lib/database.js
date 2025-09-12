import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

let connection;

export async function getConnection() {
  if (!connection) {
    try {
      console.log("🔑 DB Config:", {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port,
      });

      connection = await mysql.createConnection(dbConfig);
      console.log("✅ Connected to MySQL database");
    } catch (error) {
      console.error("❌ Error connecting to MySQL:", error);
      throw error;
    }
  }
  return connection;
}

export async function initializeDatabase() {
  try {
    const conn = await getConnection();

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        contact VARCHAR(20) NOT NULL,
        image TEXT,
        email_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await conn.execute(createTableQuery);
    console.log("✅ Schools table created or already exists");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    throw error;
  }
}

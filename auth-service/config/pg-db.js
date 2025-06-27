const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const adminDBName = process.env.POSTGRES_ADMIN_DB_NAME;
const adminDBUser = process.env.POSTGRES_ADMIN_DB_USER;
const adminDBHost = process.env.POSTGRES_ADMIN_HOST;
const adminDBPORT = process.env.POSTGRES_ADMIN_PORT;
const adminDBPassword = process.env.POSTGRES_ADMIN_PASSWORD;
const dbName = process.env.POSTGRES_DB_NAME;
const dbPassword = process.env.POSTGRES_DB_PASSWORD;
const dbPort = process.env.POSTGRES_DB_PORT;
const dbUser = process.env.POSTGRES_DB_USER;
const dbHost = process.env.POSTGRES_DB_HOST;

const envVariables = [
  { name: "POSTGRES_DB_NAME", value: dbName },
  { name: "POSTGRES_DB_PASSWORD", value: dbPassword },
  { name: "POSTGRES_DB_PORT", value: dbPort },
  { name: "POSTGRES_DB_USER", value: dbUser },
  { name: "POSTGRES_DB_HOST", value: dbHost },
  { name: "POSTGRES_ADMIN_DB_NAME", value: adminDBName },
  { name: "POSTGRES_ADMIN_PASSWORD", value: adminDBPassword },
  { name: "POSTGRES_ADMIN_PORT", value: adminDBPORT },
  { name: "POSTGRES_ADMIN_DB_USER", value: adminDBUser },
  { name: "POSTGRES_ADMIN_HOST", value: adminDBHost },
];

const missingVariables = envVariables.filter(({ value }) => !value);

if (missingVariables.length > 0) {
  missingVariables.forEach(({ name }) => {
    console.error(
      `Error creating database: Value for the environment variable ${name} is not provided.`
    );
  });
  process.exit(1);
}

const adminPool = new Pool({
  user: adminDBUser,
  host: adminDBHost,
  database: adminDBName,
  password: adminDBPassword,
  port: adminDBPORT,
});

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: dbPort,
});
const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;

async function getDatabase() {
  try {
    const client = await adminPool.connect();
    try {
      const res = await client.query(checkDbQuery, [dbName]);

      if (res.rows.length === 0) {
        await client.query(`CREATE DATABASE ${dbName};`);
        console.log(`Database "${dbName}" created successfully.`);
        return;
      } else {
        console.log(`Connected to "${dbName}" Database`);
        return;
      }
    } catch (err) {
      console.error("Error creating database:", err);
    } finally {
      client.release();
    }
    try {
      await pool.connect();
    } catch (error) {
      console.log(error);
    }
  } catch (err) {
    console.log(err);
  }
}

getDatabase();

module.exports = { pool, getDatabase };

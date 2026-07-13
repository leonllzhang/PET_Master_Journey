const { Client } = require("pg");

const DB_NAME = "pet_master_journey";
const DB_USER = "pet_user";
const DB_PASS = "pet_pass_2026";

async function main() {
  // Connect to default 'medlink' database (or 'postgres') as superuser
  const client = new Client({
    host: "81.70.175.41",
    port: 5432,
    user: "medlink",
    password: "medlink_pass",
    database: "postgres",
  });

  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // Check if database exists
    const dbRes = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (dbRes.rows.length === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`✅ Database "${DB_NAME}" created`);
    } else {
      console.log(`ℹ️  Database "${DB_NAME}" already exists`);
    }

    // Check if user exists
    const userRes = await client.query(
      `SELECT 1 FROM pg_roles WHERE rolname = $1`,
      [DB_USER]
    );

    if (userRes.rows.length === 0) {
      await client.query(`CREATE USER "${DB_USER}" WITH PASSWORD '${DB_PASS}'`);
      console.log(`✅ User "${DB_USER}" created`);
    } else {
      console.log(`ℹ️  User "${DB_USER}" already exists`);
    }

    // Grant privileges
    await client.query(`GRANT ALL PRIVILEGES ON DATABASE "${DB_NAME}" TO "${DB_USER}"`);
    // Grant schema permissions for the new database
    const dbClient = new Client({
      host: "81.70.175.41",
      port: 5432,
      user: "medlink",
      password: "medlink_pass",
      database: DB_NAME,
    });
    await dbClient.connect();
    await dbClient.query(`GRANT ALL ON SCHEMA public TO "${DB_USER}"`);
    await dbClient.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${DB_USER}"`);
    await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO "${DB_USER}"`);
    await dbClient.end();

    console.log(`✅ Privileges granted to "${DB_USER}"`);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();

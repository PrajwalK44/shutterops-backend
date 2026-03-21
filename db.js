const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required in environment variables");
}

const isSupabase = process.env.DATABASE_URL.includes("supabase.co");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSupabase ? { rejectUnauthorized: false } : false,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL client error:", error);
});

async function query(text, params = []) {
  return pool.query(text, params);
}

module.exports = {
  pool,
  query,
};

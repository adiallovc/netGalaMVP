const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/node-postgres');
const schema = require('../shared/schema');

// Check for database connection URL
if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL environment variable');
  process.exit(1);
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Create Drizzle ORM instance
const db = drizzle(pool, { schema });

module.exports = {
  db,
  pool,
  schema
};
const { sql } = require('drizzle-orm');
const { db, pool } = require('./index');
const schema = require('../shared/schema');

async function main() {
  console.log('Starting database migration...');
  
  try {
    // Create all tables
    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Creating videos table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS videos (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        video_url TEXT NOT NULL,
        thumbnail_url TEXT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        views INTEGER NOT NULL DEFAULT 0
      )
    `);
    
    console.log('Creating followers table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS followers (
        id SERIAL PRIMARY KEY,
        follower_id INTEGER NOT NULL REFERENCES users(id),
        following_id INTEGER NOT NULL REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Creating likes table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS likes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        video_id INTEGER NOT NULL REFERENCES videos(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Creating comments table...');
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id),
        video_id INTEGER NOT NULL REFERENCES videos(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

main();
const { sql } = require('drizzle-orm');
const { text, timestamp, integer, pgTable, serial, varchar, boolean } = require('drizzle-orm/pg-core');

// Users table
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Videos table
const videos = pgTable('videos', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  userId: integer('user_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  views: integer('views').default(0).notNull()
});

// Followers table - to track who follows whom
const followers = pgTable('followers', {
  id: serial('id').primaryKey(),
  followerId: integer('follower_id').references(() => users.id).notNull(),
  followingId: integer('following_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Likes table - to track video likes
const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  videoId: integer('video_id').references(() => videos.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Comments table
const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  videoId: integer('video_id').references(() => videos.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

module.exports = {
  users,
  videos,
  followers,
  likes,
  comments
};
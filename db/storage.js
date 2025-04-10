const { eq, and, desc } = require('drizzle-orm');
const { db } = require('./index');
const { users, videos, followers, likes, comments } = require('../shared/schema');

// User-related functions
async function getUserById(id) {
  try {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by username:', error);
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

async function createUser(userData) {
  try {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Video-related functions
async function getVideoById(id) {
  try {
    const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error getting video by ID:', error);
    throw error;
  }
}

async function getRecentVideos(limit = 10) {
  try {
    return await db.select().from(videos).orderBy(desc(videos.createdAt)).limit(limit);
  } catch (error) {
    console.error('Error getting recent videos:', error);
    throw error;
  }
}

async function getVideosByUserId(userId) {
  try {
    return await db.select().from(videos)
      .where(eq(videos.userId, userId))
      .orderBy(desc(videos.createdAt));
  } catch (error) {
    console.error('Error getting videos by user ID:', error);
    throw error;
  }
}

async function createVideo(videoData) {
  try {
    const result = await db.insert(videos).values(videoData).returning();
    return result[0];
  } catch (error) {
    console.error('Error creating video:', error);
    throw error;
  }
}

// Follower-related functions
async function followUser(followerId, followingId) {
  try {
    const result = await db.insert(followers).values({
      followerId,
      followingId
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

async function unfollowUser(followerId, followingId) {
  try {
    await db.delete(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      );
    return true;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

async function isFollowing(followerId, followingId) {
  try {
    const result = await db.select().from(followers)
      .where(
        and(
          eq(followers.followerId, followerId),
          eq(followers.followingId, followingId)
        )
      )
      .limit(1);
    return result.length > 0;
  } catch (error) {
    console.error('Error checking if following:', error);
    throw error;
  }
}

async function getFollowerCount(userId) {
  try {
    const result = await db.select({ count: sql`count(*)` }).from(followers)
      .where(eq(followers.followingId, userId));
    return result[0]?.count || 0;
  } catch (error) {
    console.error('Error getting follower count:', error);
    throw error;
  }
}

module.exports = {
  // User functions
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  
  // Video functions
  getVideoById,
  getRecentVideos,
  getVideosByUserId,
  createVideo,
  
  // Follower functions
  followUser,
  unfollowUser,
  isFollowing,
  getFollowerCount
};
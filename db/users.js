const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(
      `INSERT INTO users(username, password)
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING 
       RETURNING id, username;`,
      [username, password]
    );

    return user;
  } catch (error) {
    console.error("failed to create user!")
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username
      FROM users
      WHERE username=$1 AND password=$2;
    `,
      [username, password]
    );

    return user;
  } catch (error) {
    console.error("failed to get user!")
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT id, username
      FROM users
      WHERE id=$1;
    `,
      [userId]
    );

    return user;
  } catch (error) {
    console.error("failed to get user!")
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [userName]
    );

    return user;
  } catch (error) {
    console.error("failed to get user!")
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}

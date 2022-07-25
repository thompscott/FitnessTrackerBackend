const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `INSERT INTO users(username, password)
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING 
       RETURNING *;`,
      [username, password]
    );

    return rows;
  } catch (error) {
    console.error ("failed to create user!")
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error ("failed to get user!")
    throw error;
  }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}

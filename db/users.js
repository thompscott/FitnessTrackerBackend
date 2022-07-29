const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const SALT_COUNT = 10;

    const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
    const { rows: [user] } = await client.query(
      `INSERT INTO users(username, password)
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING 
       RETURNING id, username;`,
      [username, hashedPassword]
    );

    return user;
  } catch (error) {
    console.error("Failed to create user!")
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    const hashedPassword = user.password; 
    const isValid = await bcrypt.compare(password, hashedPassword);
    if (isValid){
      const {
        rows: [user],
      } = await client.query(
        `
        SELECT id, username
        FROM users
        WHERE username=$1 AND password=$2;
      `,
        [username, hashedPassword]
      );
      return user;
    }
    else {
    
    console.error({error: "LoginError", message: "Failed to login", name: "Login Error"})
    
  }

  } catch (error) {
    console.error("Failed to get user!")
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
    console.error("Failed to get user!")
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
    console.error("Failed to get user!")
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}

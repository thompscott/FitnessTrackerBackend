const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  // return the new activity
  try {
    const {
      rows: [activity],
    } = await client.query(
      `INSERT INTO activities(name, description)
       VALUES ($1, $2) 
       ON CONFLICT (name) DO NOTHING 
       RETURNING *`,
      [name, description]
    );

    return activity;
  } catch (error) {
    console.error("failed to create activity!");
    throw error;
  }
}

async function getAllActivities() {
  // select and return an array of all activities
  try {
    const { rows } = await client.query(
      `
      SELECT *
      FROM activities;
    `
    );

    return rows;
  } catch (error) {
    console.error("failed to get activities!");
    throw error;
  }
}

async function getActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE id=$1;
    `,
      [id]
    );

    return activity;
  } catch (error) {
    console.error("failed to get activity!");
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity],
    } = await client.query(
      `
      SELECT *
      FROM activities
      WHERE name=$1;
    `,
      [name]
    );

    return activity;
  } catch (error) {
    console.error("failed to get activity!");
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");
    console.log(setString, "this is the setString")
    console.log(fields, "this is the fields")

  try {
    if (setString.length > 0) {
      const { act } = await client.query(
        `
        UPDATE activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return act;
    }
  } catch (error) {
    console.error("failed to update activity!");
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};

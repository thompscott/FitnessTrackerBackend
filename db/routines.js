const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities")

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows } = await client.query(
      `INSERT INTO routines("creatorId", "isPublic", name, goal)
       VALUES ($1, $2, $3, $4) 
       RETURNING *;`,
      [creatorId, isPublic, name, goal]
    );
    return rows[0];
  } catch (error) {
    console.error("failed to create routine!")
    throw error;
  }
}
//first branch routines
async function getRoutineById(id) {

}

async function getRoutinesWithoutActivities() { }

async function getAllRoutines() {
  try {

    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id;
    `
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {

    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE "isPublic"=true;
    `
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {

    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE users.username=$1;
    `, [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
 }

async function getPublicRoutinesByUser({ username }) {
  try {

    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE users.username=$1 AND "isPublic"=true;
    `, [username]
    );
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {

    const { rows: routines } = await client.query(
      `
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users
      ON routines."creatorId" = users.id
      WHERE "isPublic"=true;
    `
    );
    let publicRoutines = await attachActivitiesToRoutines(routines);
    publicRoutines = publicRoutines.filter(routine => {
      for (let i = 0; i < routine.activities.length; i++) {
        if (routine.activities[i].id === id) {
          return true;
        }
      }
      return false;
    });
    return publicRoutines;
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) { }

async function destroyRoutine(id) { }

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};

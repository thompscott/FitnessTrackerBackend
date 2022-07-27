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
      ON routines."creatorId" = users.id
    `
    );
    console.log(routines, "all of our routines")
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error("failed to get routines!");
    throw error;
  }
}

async function getAllPublicRoutines() { }

async function getAllRoutinesByUser({ username }) { }

async function getPublicRoutinesByUser({ username }) { }

async function getPublicRoutinesByActivity({ id }) { }

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

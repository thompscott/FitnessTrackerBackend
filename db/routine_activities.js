const { getActivityById } = require("./activities");
const client = require("./client");
const { getRoutineById } = require("./routines");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {

    const rows = await client.query(
      `INSERT INTO routine_activities("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4) 
     RETURNING *;`,
      [routineId, activityId, count, duration]
    );

    return rows
  } catch (error) {
    console.error("Failed to add activity to routine")
  }
}

async function getRoutineActivityById(id) { }

async function getRoutineActivitiesByRoutine({ id }) { }

async function updateRoutineActivity({ id, ...fields }) { }

async function destroyRoutineActivity(id) { }

async function canEditRoutineActivity(routineActivityId, userId) { }

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};

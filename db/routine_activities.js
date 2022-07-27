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

    const{ rows: [activity] } = await client.query(
      `INSERT INTO routine_activities("routineId", "activityId", count, duration)
     VALUES ($1, $2, $3, $4) 
     RETURNING *;`,
      [routineId, activityId, count, duration]
    );
    return activity
  } catch (error) {
    console.error("Failed to add activity to routine")
  }
}

async function getRoutineActivityById(id) { 

  try {
    const { rows: [activity] } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE routine_activities.id=$1;
  `, [id]
    );
    return activity
  } catch (error) {
    console.error("Failed to get routine activities")
    throw error;
  }

}

async function getRoutineActivitiesByRoutine({ id }) { 
  try {
    const { rows: activity } = await client.query(
      `
    SELECT *
    FROM routine_activities
    WHERE routine_activities."routineId"=$1;
  `, [id]
    );
    return activity
  } catch (error) {
    console.error("Failed to get routine activities by routines")
    throw error;
  }
  
}

async function updateRoutineActivity({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    if (setString.length > 0) {
      const { rows } = await client.query(
        `
        UPDATE routine_activities
        SET ${setString}
        WHERE id=${id}
        RETURNING *;
      `,
        Object.values(fields)
      );
      return rows[0];
    }
  } catch (error) {
    console.error("Failed to update routine activities!");
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const { rows: [routId] } = 
    await client.query(
      `
    DELETE 
    FROM routine_activities
    WHERE id=$1
    RETURNING id;
  `, [id]
    );
  return routId
   
  } catch (error) {
    console.error("Failed to delete routine activity!")
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) { 
  const activity = await getRoutineActivityById(routineActivityId)
  const routine = await getRoutineById(activity.routineId)
  if(routine.creatorId === userId){
    return true;
  }
  return false;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};

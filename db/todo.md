 CREATE TABLE routines (
    id SERIAL PRIMARY KEY,
    "creatorId" INTEGER REFERENCES users(id),
    "isPublic" BOOLEAN DEFAULT false,
    name VARCHAR(255) UNIQUE NOT NULL,
    goal TEXT NOT NULL

    To Do

    getusernamebyid to get username, call it creatorName
    use routines id to get duration, count, activityId, RoutineactvityIds from routine_activities
    use activityById to get activities name and description from activities, include routineId and routineActvityIds
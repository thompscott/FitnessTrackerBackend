const express = require('express');
const app = express();
// const { createUser, getUserByUsername } = require('../db/');
const router = express.Router();



// GET /api/health
router.get('/health', async (req, response, next) => {
    response.body=await {message:"string"}
    response.send('Server is up!')
    console.log(response.body.message)
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);
router.use('/users/register', usersRouter);
router.use('/users/login', usersRouter);
router.use('/users/me', usersRouter);
router.use('/users/:username/routines', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);
router.use('/activities/:activityId/routines', activitiesRouter);
router.use('/activities/:activityId', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);
router.use('/routines/:routineId', routinesRouter);
router.use('/routines/:routineId/activities', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);
router.use('/routine_activities/:routineActivityId', routineActivitiesRouter);

module.exports = router;

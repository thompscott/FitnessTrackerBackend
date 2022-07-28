const express = require('express');
const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { getUserById } = require('../db/');
const router = express.Router();

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");
  
    if (!auth) {
      // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);
  
      try {
        const { id } = jwt.verify(token, JWT_SECRET);
  
        if (id) {
          req.user = await getUserById(id);
          next();
        }
      } catch ({ name, message }) {
        next({ name, message });
      }
    } else {
        res.status(401).end()
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  });
  
  router.use((req, res, next) => {
    if (req.user) {
      console.log("User is set:", req.user);
    }
  
    next();
  });

router.get('/health', async (req, res, next) => {
    try {
        res.send({message:"Server is up!"})
    }
    catch(error){
        next(error)
    }
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


// Error Handler

module.exports = router;

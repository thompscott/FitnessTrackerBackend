const express = require('express');
const { getAllActivities, createActivity, updateActivity, getActivityByName, getActivityById, getPublicRoutinesByActivity } = require('../db');
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines
activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
    try {
        if (! await getActivityById(req.params.activityId)) {
            res.send({ error: "activity error", message: `Activity ${req.params.activityId} not found`, name: "existingactivityerror" })
        }
        // Problem req.params don't work
        const actId = req.params.activityId
        console.log(actId, "this is our activity")
        const activities = await getPublicRoutinesByActivity({ id: actId })
        // console.log(activities, "this is our activity")
        res.send(activities)
    } catch (error) {
        next(error);
    }
})

// GET /api/activities
activitiesRouter.get("/", async (req, res, next) => {
    try {
        const activities = await getAllActivities()
        res.send(activities)
    } catch (error) {
        next(error);
    }
})

// POST /api/activities
activitiesRouter.post("/", async (req, res, next) => {
    try {
        const activities = await createActivity({ name: req.body.name, description: req.body.description })
        if (activities) {
            res.send(activities)
        } else {
            res.send({ error: "activity error", message: `An activity with name ${req.body.name} already exists`, name: "existingactivityerror" })
        }

    } catch (error) {
        next(error)
    }
})

// PATCH /api/activities/:activityId
activitiesRouter.patch("/:activityId", async (req, res, next) => {
    try {
        const name = req.body.name
        const description = req.body.description
        if (! await getActivityById(req.params.activityId)) {
            res.send({ error: "activity error", message: `Activity ${req.params.activityId} not found`, name: "existingactivityerror" })
        }
        if (await getActivityByName(name)) {
            res.send({ error: "activity error", message: `An activity with name ${name} already exists`, name: "existingactivityerror" })
        }
        const activities = await updateActivity({ id: req.params.activityId, name, description })
        res.send(activities)

    } catch (error) {
        next(error);
    }
})

module.exports = activitiesRouter;

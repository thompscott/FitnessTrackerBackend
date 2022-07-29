const express = require('express');
const routineActivitiesRouter = express.Router();
const { updateRoutineActivity, getRoutineActivityById, getRoutineById, destroyRoutineActivity } = require("../db")

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch("/:routineActivityId", async (req, res, next) => {
    try {
        const routineAct = await getRoutineActivityById(req.params.routineActivityId)
        if (req.user) {
            if (routineAct) {
                const routine = await getRoutineById(routineAct.routineId)
                if (req.user.id === routine.creatorId) {
                    const activities = await updateRoutineActivity({ id: req.params.routineActivityId, count: req.body.count, duration: req.body.duration })

                    res.send(activities)
                } else {
                    res.send({
                        error: 'UpdateError',
                        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
                        name: "Update Routine Activities Error",
                    })
                }

            } else {
                res.send({
                    error: 'UpdateError',
                    message: `RoutineActivity ${req.params.routineActivityId} does not exist`,
                    name: "Update Routine Activities Error",
                })


            }
        } else {
            res.send({
                error: 'UpdateError',
                message: `Must be logged in to perform that action`,
                name: "Update Routine Activities Error",
            })
        }

    } catch (error) {
        next(error)
    }
})
// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete("/:routineActivityId", async (req, res, next) => {
    try {
        const routineAct = await getRoutineActivityById(req.params.routineActivityId)
        if (req.user) {
            if (routineAct) {
                const routine = await getRoutineById(routineAct.routineId)
                if (req.user.id === routine.creatorId) {
                    const activities = await destroyRoutineActivity(req.params.routineActivityId)

                    res.send(activities)
                } else {
                    res
                        .status(403)
                        .send({
                            error: "403 - Unauthorized",
                            message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
                            name: "UnauthorizedError",
                        });

                }

            } else {
                res.send({
                    error: 'DeleteError',
                    message: `RoutineActivity ${req.params.routineActivityId} does not exist`,
                    name: "Delete Routine Activities Error",
                })


            }
        } else {
            res.send({
                error: 'DeleteError',
                message: `Must be logged in to perform that action`,
                name: "Delete Routine Activities Error",
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = routineActivitiesRouter;

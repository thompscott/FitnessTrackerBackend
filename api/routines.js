const express = require('express');
const {getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, destroyRoutine, addActivityToRoutine } = require('../db');
const routinesRouter = express.Router();

// GET /api/routines
routinesRouter.get('/', async(req, res, next) =>{
    try {
        const routines = await getAllPublicRoutines();
        res.send(routines);
    }
    catch (error) {
        next(error);
    }
    
})

// POST /api/routines
routinesRouter.post('/', async(req, res, next) =>{
    try {
        if(req.user){
            const routine = await createRoutine({creatorId: req.user.id, isPublic: req.body.isPublic, name: req.body.name, goal: req.body.goal });
       res.send(routine);
        }
        else{
            res.send({error: "LoginError", message: "You must be logged in to perform this action", name: "Login Error"});
        }
    }
    catch (error) {
        next(error);
    }
    
})
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', async(req, res, next) =>{
    try {
        // const routineCheck  = await getRoutineById(req.params.routineId);
        if (req.user ) {
            const routineCheck  = await getRoutineById(req.params.routineId);
            if (req.user.id === routineCheck.creatorId) {
                const isPublic = req.body.isPublic;
            const name = req.body.name;
            const goal = req.body.goal;
            const routine = await updateRoutine({id: req.params.routineId, isPublic, name, goal });
            res.send(routine);    
        }
            else{
                res
              .status(403)
              .send({
                error: "403 - Unauthorized",
                message: `User ${req.user.username} is not allowed to update ${routineCheck.name}`,
                name: "UnauthorizedError",
              });
            }
            
       
          } else {
            res.send({
                error: "LoginError",
                message: "You must be logged in to perform this action",
                name: "Login Error",
              });
          }
    }
    catch (error) {
        next(error);
    }
    
})

// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', async(req, res, next) =>{
    try{
        
        if (req.user ) {
            const routineCheck  = await getRoutineById(req.params.routineId);
            if (req.user.id === routineCheck.creatorId) {
                const routine = await destroyRoutine(req.params.routineId)
                res.send(routineCheck);    
        }
            else{
                res
              .status(403)
              .send({
                error: "403 - Unauthorized",
                message: `User ${req.user.username} is not allowed to delete ${routineCheck.name}`,
                name: "UnauthorizedError",
              });
            }
            
       
          } else {
            res.send({
                error: "LoginError",
                message: "You must be logged in to perform this action",
                name: "Login Error",
              });
          }
    }
    catch(error){
        next(error);
    }
})

// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', async(req, res, next) =>{
    try{
        const activity = await addActivityToRoutine({ routineId:req.params.routineId, activityId:req.body.activityId, count:req.body.count, duration:req.body.duration, });
        if(activity){
            res.send(activity);
        }
        else{
            res.send({
                error: "AddActivityToRoutineError",
                message: `Activity ID ${req.body.activityId} already exists in Routine ID ${req.params.routineId}`,
                name: "Add Activity To Routine Error",
              });
        }
        
    }
    catch (error) {
        next(error);
    }
})
module.exports = routinesRouter;

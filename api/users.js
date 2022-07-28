/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUsername } = require('../db/index')

usersRouter.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      if(password.length < 8) {
        next({
          error: "ShortPassword",
          name: "ShortPasswordError",
          message: "Password Too Short!"
        })
      }
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          error: "UserExists",
          name: "UserExistsError",
          message: `User ${username} is already taken.`,
        });
      }
  
      const user = await createUser({
        username,
        password,
      });

      const token = jwt.sign(
        {
          id: user.id,
          username,
        },
        JWT_SECRET,
        {
          expiresIn: '1w',
        }
      );
  
      res.send({
        message: "thank you for signing up",
        token: " ",
        user: user,
    
      });
    } catch ({ error, name, message }) {
      next({ error, name, message });
    }
  });


// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter;

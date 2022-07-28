/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUsername, getUserById } = require('../db/index')
const { JWT_SECRET } = process.env
const jwt = require("jsonwebtoken")


usersRouter.post("/register", async (req, res, next) => {
  console.log(JWT_SECRET)
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


 usersRouter.post("/login", async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password",
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password === password) {
        // create token & return to user
        const newToken = jwt.sign(
          {
            id: user.id,
            username: user.username,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1w" }
        );
        res.send({user:user, token: newToken, message: "you're logged in!" });
      } else {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  usersRouter.get('/me', async (req, res, next) => {
    try {
      console.log(req.user.id)
      if (req.user.id) {
       const user = await getUserById(req.user.id)
       console.log(req.user.id)
       res.send(user)
      } else {
        res.status(401).send ("some str4ing")
        // next({
        //   error: "Invalid token",
        //   name: "Token is not valid",
        //   message: `Invalid token when login`,
        // });
      }
      // const user = await getUserByUsername(username);
  
      // if (user && user.password === password) {
      //   // create token & return to user
      //   const newToken = jwt.sign(
        //   {
        //     id: user.id,
        //     username: user.username,
        //   },
        //   process.env.JWT_SECRET,
        //   { expiresIn: "1w" }
        // );
        // res.send({user:user, token: newToken, message: "you're logged in!" });
      // } else {
      //   next({
      //     name: "IncorrectCredentialsError",
      //     message: "Username or password is incorrect",
      //   });
      // }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

  

// GET /api/users/:username/routines

module.exports = usersRouter;

require("dotenv").config()
const express = require("express")
const cors = require('cors');
const app = express()
const router = require('./api');
// Setup your Middleware and API Router here

app.use(cors())


app.use((req, res, next) => {
  console.log('<____Body Logger START____>');
  console.log(req.body);
  console.log('<_____Body Logger END_____>');

  next();
});

app.get('/', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})
app.use(express.json());

app.use('/api', router);


module.exports = app;

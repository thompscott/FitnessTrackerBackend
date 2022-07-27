require("dotenv").config()
const express = require("express")
const cors = require('cors');
const app = express()

// Setup your Middleware and API Router here

app.use(cors())

app.get('/', function (req, res, next) {
    res.json({ msg: 'This is CORS-enabled for all origins!' })
})

app.listen(3000, function () {
    console.log('CORS-enabled web server listening on port 3000')
})

module.exports = app;

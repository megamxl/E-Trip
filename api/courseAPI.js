const express = require('express');

const app = express();
app.use(express.json());



app.get('/getCourses', async (req, res) => {


  res.send("api")
  console.log("api")
});

module.exports = app

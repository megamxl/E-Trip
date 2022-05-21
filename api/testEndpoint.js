const express = require('express');

const app = express();
app.use(express.json());



app.post('/getCourses', async (req, res) => {



  console.log("api")
  res.send("api")
});


module.exports = app


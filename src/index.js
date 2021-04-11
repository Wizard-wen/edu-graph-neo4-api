//app.js
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const neo4j = require("neo4j-driver");
const app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(express.static(path.join(__dirname, "public")));

const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '888888'));
const session = driver.session();

app.get("/", (req, res) =>  {
  session.run('MATCH(n:PERSON) RETURN n')
    .then((result) => {
      result.records.forEach((record) => {
        console.log(record._fields[0].properties);
      });
    })
    .catch(function (err) {
      console.log(err);
    });
  res.send('It works')
})

app.post('/create', async (request, response) => {
  const result = await session.writeTransaction((txc)=> txc.run(`CREATE (person: PERSON {name: $name})`, {
    name: request.body.name
  }))
  response.send(result);
})
app.listen(3000);
console.log("Server Started on Port 3000");
module.exports = app;

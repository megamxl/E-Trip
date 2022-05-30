const express = require('express');
const https = require("https");
const {response} = require("express");
import fetch from 'node-fetch';


const app = express();
app.use(express.json());

const carListAll = 'query carListAll {\n'+
  '  carList(size:407) {\n'+
  '    id\n'+
  '    connectors{standard}\n'+
  '    naming{\n'+
  '      model\n'+
  '      make\n'+
  '    }\n'+
  '  }}';

const carID ='query car($carId: ID!) {\n'+
  '  car(id: $carId) {\n'+
  '    naming{\n'+
  '      make\n'+
  '    	model\n'+
  '    }\n'+
  '  }\n'+
  '}';
let ID = '"5d161be5c9eef46132d9d20a"'

let carIDVariable = '{"carId":'+ID+'}';
let carListVariables = null
async function graphQLRequest(ourBody, ourVariables) {
  return await fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    body: JSON.stringify({
      query: ourBody,
      variables: ourVariables,
    })
  }).then(r => r.json())
}

app.get('/getAllCars', async (req, res) => {
  res.send(await graphQLRequest(carListAll,carListVariables))
});

app.get('/getCarById', async (req, res) => {
  res.send(await graphQLRequest(carID,carIDVariable))

});


module.exports = app


const express = require('express');
const https = require("https");
import fetch from 'node-fetch';

const app = express();
app.use(express.json());


let chargingPoints ='query stationAround {\n'+
  '  stationAround(\n'+
  '    query: {\n'+
  '      location: { type: Point, coordinates: [16.38, 48.15] }\n'+
  '      distance: 10000\n'+
  '      power: 22\n'+
  '    }\n'+
  '  ) \n'+
  '  {name\n'+
  '    address\n'+
  '    postal_code\n'+
  '    city\n'+
  '    power\n'+
  '    speed\n'+
  '  }\n'+
  '}';

async function graphQLRequest(ourBody, ourVariables) {
  return await fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    body: JSON.stringify({
      query: ourBody,
      variables: {ourVariables},
    })
  }).then(r => r.json())
}

app.get('/getChargerNearby', async (req,res) =>{
  res.send(await graphQLRequest(chargingPoints))


});

module.exports = app


const express = require('express');
const https = require("https");
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

function chargingPoints(body){
return 'query stationAround {\n'+
  '  stationAround(\n'+
  '    query: {\n'+
  '      location: { type: Point, coordinates: ['+body.longitudeStart+', '+body.latitudeStart+'] }\n'+
  '      distance: '+body.distance+'\n'+
  '      power: '+body.power+'\n'+
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
}

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
  res.send(await graphQLRequest(chargingPoints(req.body),))
});

module.exports = app


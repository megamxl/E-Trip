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

function checkBodyForChargers(body){
  if(typeof body.longitudeStart   === 'number' && !Number.isNaN(body.longitudeStart) && !Number.isInteger(body.longitudeStart)){
    if(typeof body.latitudeStart   === 'number' && !Number.isNaN(body.latitudeStart) && !Number.isInteger(body.latitudeStart)  ){
      if(typeof body.distance   === 'number' && !Number.isNaN(body.distance) && Number.isInteger(body.distance) ){
        return true
      }
    }
  }
  return false

}


app.get('/getChargerNearby', async (req,res) =>{
  if(checkBodyForChargers(req.body)){

    res.send(await graphQLRequest(chargingPoints(req.body)))
  }else{
    res.sendStatus(400)
  }

});

module.exports = app


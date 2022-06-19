const express = require('express');
const https = require("https");
import fetch from 'node-fetch';

const options = {compact: true, ignoreComment: true, spaces: 4}
const xml = require('xml-js');

const app = express();
app.use(express.json());

function chargingPoints(body) {
  return 'query stationAround {\n' +
    '  stationAround(\n' +
    '    query: {\n' +
    '      location: { type: Point, coordinates: [' + body.longitudeStart + ', ' + body.latitudeStart + '] }\n' +
    '      distance: ' + body.distance + '\n' +
    '      power: [50, 22]\n'+
    '      amenities: ["supermarket"]\n'+
    '    }\n'+
    '    size: 10\n'+
    '    page: 0\n'+
    '  ) {\n'+
    '    id\n'+
    '    external_id\n'+
    '    name\n'+
    '    location {\n'+
    '      type\n'+
    '      coordinates\n'+
    '    }\n'+
    '    elevation\n'+
    '    physical_address {\n'+
    '      continent\n'+
    '      country\n'+
    '      county\n'+
    '      city\n'+
    '      street\n'+
    '      number\n'+
    '      postalCode\n'+
    '      what3Words\n'+
    '      formattedAddress\n'+
    '    }\n'+
    '    amenities\n'+
    '    power\n'+
    '    # add more fields here\n'+
    '  }\n'+
    '}';
}

async function graphQLRequest(ourBody, xmlHeader, ourVariables) {
  let answer = await fetch('https://api.chargetrip.io/graphql', {
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
  if (xmlHeader === "true") {
    return xml.json2xml(answer, options)
  } else {
    return answer
  }
}

function checkBodyForChargers(body) {
  if (typeof body.longitudeStart === 'number' && !Number.isNaN(body.longitudeStart) && !Number.isInteger(body.longitudeStart)) {
    if (typeof body.latitudeStart === 'number' && !Number.isNaN(body.latitudeStart) && !Number.isInteger(body.latitudeStart)) {
      if (typeof body.distance === 'number' && !Number.isNaN(body.distance) && Number.isInteger(body.distance)) {
        return true
      }
    }
  }
  return false

}


app.post('/getChargerNearby', async (req, res) => {
  if (checkBodyForChargers(req.body)) {
    res.send(await graphQLRequest(chargingPoints(req.body), req.headers.xml))
  } else {
    res.sendStatus(400)
  }


})
/*
PATCH is used for **modify** capabilities. The PATCH request only needs to contain the changes to the resource, not the complete resource.
This resembles PUT, but the body contains a set of instructions describing how a resource currently residing on the server should be modified to produce a new version.
This means that the PATCH body should not just be a modified part of the resource, but in some kind of patch language like JSON Patch or XML Patch.
PATCH is neither safe nor idempotent. However, a PATCH request can be issued in such a way as to be idempotent, which also helps prevent bad outcomes from collisions between two PATCH requests on the same resource in a similar time frame.
Collisions from multiple PATCH requests may be more dangerous than PUT collisions because some patch formats need to operate from a known base-point or else they will corrupt the resource.
Clients using this kind of patch application should use a conditional request such that the request will fail if the resource has been updated since the client last accessed the resource.
For example, the client can use a strong ETag in an If-Match header on the PATCH request.
*/

/*Implement PATCH here*/

;

//app.patch();

module.exports = app


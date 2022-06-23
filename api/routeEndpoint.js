// importing all library to handle our request to charge trips.
const express = require('express');
import fetch from 'node-fetch';

const options = {compact: true, ignoreComment: true, spaces: 4}
const xml = require('xml-js');

// creating the first endpoint like in ex 4
const app = express();
app.use(express.json());

/**
 * works with a body from a request and returns the graphql query
 * @param body response body with  chargeValue, chargeValueType, occupants, longitudeStart, latitudeStart, cityStart, countryStart, longitudeEnd, latitudeEnd, cityEnd, countryEnd ,carID
 * @returns {string} the query for a new route
 */
function routeId(body) {
  return 'mutation newRoute($carId: ID!) {\n' +
    '  newRoute(\n' +
    '    input: {\n' +
    '      ev: { id: $carId, battery: { stateOfCharge: { value: ' + body.chargeValue + ', type: ' + body.chargeValueType + ' } }, climate: true, occupants: ' + body.occupants + ' }\n' +
    '      routeRequest: {\n' +
    '        origin: {\n' +
    '          type: Feature\n' +
    '          geometry: { type: Point, coordinates: [' + body.longitudeStart + ', ' + body.latitudeStart + '] }\n' +
    '          properties: { name: "' + body.cityStart + ', ' + body.countryStart + '" }\n' +
    '        }\n' +
    '        destination: {\n' +
    '          type: Feature\n' +
    '          geometry: { type: Point, coordinates: [' + body.longitudeEnd + ', ' + body.latitudeEnd + '] }\n' +
    '          properties: { name: "' + body.cityEnd + ', ' + body.countryEnd + '" }\n' +
    '        }\n' +
    '      }\n' +
    '    }\n' +
    '  )\n' +
    '}';
}


/**
 * gets the route from chargetrip server
 * @param routeID a created id from chargetrip
 * @returns {string} query for a route from chargetrip
 */
function planRoute(routeID) {
  return 'query getRoute {\n' +
    '  route(id: "' + routeID + '") {\n' +
    '    route {\n' +
    '      id\n' +
    '      type\n' +
    '      charges\n' +
    '      distance\n' +
    '      duration\n' +
    '      consumption\n' +
    '      chargeTime\n' +
    '      amenityRanking\n' +
    '      rangeStart\n' +
    '      rangeStartKwh\n' +
    '      rangeEnd\n' +
    '      rangeEndKwh\n' +
    '      via\n' +
    '      elevationUp\n' +
    '      elevationDown\n' +
    '      elevationMax\n' +
    '      pathPlot{\n' +
    '        elevation\n' +
    '        consumptionPerKm\n' +
    '        averageSpeed\n' +
    '      }\n' +
    '      polyline\n' +
    '      saving {\n' +
    '        co2\n' +
    '        money\n' +
    '        currency\n' +
    '        averageGasPrice\n' +
    '        averageEnergyPrice\n' +
    '      }\n' +
    '      legs {\n' +
    '        id\n' +
    '        distance\n' +
    '        duration\n' +
    '        consumption\n' +
    '        rangeStart\n' +
    '        rangeStartKwh\n' +
    '        rangeEnd\n' +
    '        rangeEndKwh\n' +
    '        origin {\n' +
    '          id\n' +
    '          type\n' +
    '          geometry {\n' +
    '            type\n' +
    '            coordinates\n' +
    '          }\n' +
    '          properties\n' +
    '        }\n' +
    '        destination {\n' +
    '          id\n' +
    '          type\n' +
    '          geometry {\n' +
    '            type\n' +
    '            coordinates\n' +
    '          }\n' +
    '          properties\n' +
    '        }\n' +
    '        type\n' +
    '        name\n' +
    '        stationId\n' +
    '        operatorId\n' +
    '        chargeTime\n' +
    '        evse {\n' +
    '          uid\n' +
    '          evse_id\n' +
    '          physical_reference\n' +
    '          status\n' +
    '          connectors {\n' +
    '            id\n' +
    '            power\n' +
    '            max_amperage\n' +
    '            max_voltage\n' +
    '            max_electric_power\n' +
    '            standard\n' +
    '            format\n' +
    '            power_type\n' +
    '            properties\n' +
    '          }\n' +
    '          parking_restrictions\n' +
    '          properties\n' +
    '        }\n' +
    '        connector {\n' +
    '          id\n' +
    '          power\n' +
    '          max_amperage\n' +
    '          max_voltage\n' +
    '          max_electric_power\n' +
    '          standard\n' +
    '          properties\n' +
    '        }\n' +
    '        plugsAvailable\n' +
    '        plugsCount\n' +
    '      }\n' +
    '    }\n' +
    '    status\n' +
    '  }\n' +
    '}\n' +
    '';
}

function carId(carID) {
  return '{"carId":"' + carID + '"}';
}

/**
 * lets the process sleep
 * @param ms tiem in ms
 * @returns {Promise<unknown>} basically nothing but NOP
 */
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * handwritten graphQlRequest request with provided query
 * @param ourBody the query
 * @param xmlHeader info if the output should be xml
 * @param ourVariables variable if you want to change something in the query
 * @returns {Promise<string|any>} the response from chargetrip
 */
async function graphQLRequest(ourBody, xmlHeader, ourVariables) {

   // fetch ( url, options ) option is an object
  const answer = await fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    body: JSON.stringify({
      query: ourBody,
      variables: ourVariables,
    })
  }).then(r => r.json());

  if (xmlHeader === "true") {
    return xml.json2xml(answer, options)
  } else {
    return answer
  }
}

/**
 * returns route if provided id is there
 */
app.get('/getRoute', async (req, res) => {
  if(req.headers.xml=="true"){res.send(await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid)))}
  let test = await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid))
  // because the server takes it time we check if our route is finished if not we do it until we have one
  while (test.data.route.status === 'processing') {
    await sleep(50);
    test = await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid))
  }
  res.send(test)
});

/*
The POST verb is most-often utilized to **create** new resources. In particular, it's used to create subordinate resources. That is, subordinate to some other (e.g. parent) resource. In other words, when creating a new resource,
POST to the parent and the service takes care of associating the new resource with the parent, assigning an ID (new resource URI), etc.
On successful creation, return HTTP status 201, returning a Location header with a link to the newly-created resource with the 201 HTTP status.
POST is neither safe nor idempotent. It is therefore recommended for non-idempotent resource requests. Making two identical POST requests will most-likely result in two resources containing the same information.

*/


/**
 * if all provided detail are valid you will get a route id back and if not the false infos will be the response
 */
app.post('/createRoute', async (req, res) => {
  res.send(await graphQLRequest(routeId(req.body), req.headers.xml, carId(req.body.carID)))
});

module.exports = app


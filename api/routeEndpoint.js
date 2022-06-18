const express = require('express');
const https = require("https");
import fetch from 'node-fetch';
const options = {compact: true, ignoreComment: true, spaces: 4}
const xml = require('xml-js');

const app = express();
app.use(express.json());

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
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function graphQLRequest(ourBody, xmlHeader, ourVariables) {

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
    // console.log("Answer: ", answer);
  //  if(answer.data.route.status === 'processing') {
      if (xmlHeader === "true") {
        return xml.json2xml(answer, options)
      } else {
        return answer
      }
  //  }

}

app.get('/getRoute', async (req, res) => {
  // console.log("Passed values: ", await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid)))
  let test = await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid))
  while (test.data.route.status === 'processing'){
    await sleep(50);
    test = await graphQLRequest(planRoute(req.headers.routeid), req.headers.xml, carId(req.headers.carid))
  }
  res.send(test)
});


app.post('/createRoute', async (req, res) => {
  res.send(await graphQLRequest(routeId(req.body), req.headers.xml, carId(req.body.carID)))

});


app.delete('/removeRoute', async (req, res) => {

});


app.put('/mutateRoute', async (req, res) => {


});


module.exports = app


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

/*
The POST verb is most-often utilized to **create** new resources. In particular, it's used to create subordinate resources. That is, subordinate to some other (e.g. parent) resource. In other words, when creating a new resource,
POST to the parent and the service takes care of associating the new resource with the parent, assigning an ID (new resource URI), etc.
On successful creation, return HTTP status 201, returning a Location header with a link to the newly-created resource with the 201 HTTP status.
POST is neither safe nor idempotent. It is therefore recommended for non-idempotent resource requests. Making two identical POST requests will most-likely result in two resources containing the same information.

*/

app.post('/createRoute', async (req, res) => {
  res.send(await graphQLRequest(routeId(req.body), req.headers.xml, carId(req.body.carID)))

});

/*
DELETE is pretty easy to understand. It is used to **delete** a resource identified by a URI.
On successful deletion, return HTTP status 200 (OK) along with a response body, perhaps the representation of the deleted item (often demands too much bandwidth), or a wrapped response (see Return Values below). Either that or return HTTP status 204 (NO CONTENT) with no response body.
In other words, a 204 status with no body, or the JSEND-style response and HTTP status 200 are the recommended responses.
HTTP-spec-wise, DELETE operations are idempotent. If you DELETE a resource, it's removed. Repeatedly calling DELETE on that resource ends up the same: the resource is gone.
If calling DELETE say, decrements a counter (within the resource), the DELETE call is no longer idempotent. As mentioned previously, usage statistics and measurements may be updated while still considering the service idempotent as long as no resource data is changed.
Using POST for non-idempotent resource requests is recommended.
There is a caveat about DELETE idempotence, however. Calling DELETE on a resource a second time will often return a 404 (NOT FOUND) since it was already removed and therefore is no longer findable.
This, by some opinions, makes DELETE operations no longer idempotent, however, the end-state of the resource is the same. Returning a 404 is acceptable and communicates accurately the status of the call.

*/

app.delete('/removeRoute', async (req, res) => {

});

/*
PUT is most-often utilized for **update** capabilities, PUT-ing to a known resource URI with the request body containing the newly-updated representation of the original resource.
However, PUT can also be used to create a resource in the case where the resource ID is chosen by the client instead of by the server. In other words, if the PUT is to a URI that contains the value of a non-existent resource ID.
Again, the request body contains a resource representation. Many feel this is convoluted and confusing. Consequently, this method of creation should be used sparingly, if at all.
Alternatively, use POST to create new resources and provide the client-defined ID in the body representation—presumably to a URI that doesn't include the ID of the resource (see POST below).
On successful update, return 200 (or 204 if not returning any content in the body) from a PUT. If using PUT for create, return HTTP status 201 on successful creation.
A body in the response is optional—providing one consumes more bandwidth. It is not necessary to return a link via a Location header in the creation case since the client already set the resource ID.
PUT is not a safe operation, in that it modifies (or creates) state on the server, but it is idempotent. In other words, if you create or update a resource using PUT and then make that same call again, the resource is still there and still has the same state as it did with the first call.
If, for instance, calling PUT on a resource increments a counter within the resource, the call is no longer idempotent. Sometimes that happens and it may be enough to document that the call is not idempotent.
However, it's recommended to keep PUT requests idempotent. It is strongly recommended to use POST for non-idempotent requests.
*/

app.put('/mutateRoute', async (req, res) => {


});


module.exports = app


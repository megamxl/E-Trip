
const express = require('express');
const xml = require('xml-js');
import fetch from 'node-fetch';

const options = {compact: true, ignoreComment: true, spaces: 4}
const app = express();
app.use(express.json());

function isEmpty(obj) {
  return Object.keys(obj.data.carList).length === 0
}

/**
 * works with a body from a request and returns the graphql query
 * @type {string} carListAll
 */
const carListAll = 'query carListAll {\n' +
  '  carList(size:407) {\n' +
  '    id\n' +
  '    connectors{standard}\n' +
  '    naming{\n' +
  '      model\n' +
  '      make\n' +
  '      version\n' +
  '    }\n' +
  '  }}';

/**
 * works with a body from a request and returns the graphql query
 * @type {string} All Car brand
 */
const carListAllBrands = 'query carListAll {\n' +
  '  carList(size:407) {\n' +
  '   naming {\n' +
  '      make\n' +
  '    }\n' +
  '  }}';

/**
 * detail fro a car with id
 * @type {string}
 */
const carID = 'query car($carId: ID!) {\n'+
  '  car(id: $carId) {\n'+
  '    id\n'+
  '    naming {\n'+
  '      make\n'+
  '      model\n'+
  '      version\n'+
  '      edition\n'+
  '      chargetrip_version\n'+
  '    }\n'+
  '    connectors {\n'+
  '      standard\n'+
  '      power\n'+
  '      time\n'+
  '      speed\n'+
  '    }\n'+
  '    adapters {\n'+
  '      standard\n'+
  '      power\n'+
  '      time\n'+
  '      speed\n'+
  '    }\n'+
  '    battery {\n'+
  '      usable_kwh\n'+
  '      full_kwh\n'+
  '    }\n'+
  '    body {\n'+
  '      seats\n'+
  '      weight\n'+
  '      width\n'+
  '      height\n'+
  '    }\n'+
  '    performance {\n'+
  '      acceleration\n'+
  '      top_speed\n'+
  '    }\n'+
  '    range {\n'+
  '      real\n'+
  '      real_is_estimated\n'+
  '      worst{\n'+
  '        highway\n'+
  '        city\n'+
  '        combined\n'+
  '      }\n'+
  '      best {\n'+
  '        highway\n'+
  '        city\n'+
  '        combined\n'+
  '      }\n'+
  '      chargetrip_range {\n'+
  '        best\n'+
  '        worst\n'+
  '      }\n'+
  '    }\n'+
  '    media {\n'+
  '      evdb_detail_url\n'+
  '      image {\n'+
  '        id\n'+
  '        type\n'+
  '        url\n'+
  '        height\n'+
  '        width\n'+
  '        thumbnail_url\n'+
  '        thumbnail_height\n'+
  '        thumbnail_width\n'+
  '      }\n'+
  '      brand {\n'+
  '        id\n'+
  '        type\n'+
  '        url\n'+
  '        height\n'+
  '        width\n'+
  '        thumbnail_url\n'+
  '        thumbnail_height\n'+
  '        thumbnail_width\n'+
  '      }\n'+
  '      image_list {\n'+
  '        id\n'+
  '        type\n'+
  '        url\n'+
  '        height\n'+
  '        width\n'+
  '        thumbnail_url\n'+
  '        thumbnail_height\n'+
  '        thumbnail_width\n'+
  '      }\n'+
  '      video {\n'+
  '        id\n'+
  '        url\n'+
  '      }\n'+
  '      video_list {\n'+
  '        id\n'+
  '        url\n'+
  '      }\n'+
  '    }\n'+
  '    routing {\n'+
  '      fast_charging_support\n'+
  '    }\n'+
  '  }\n'+
  '}\n'+
  '';

/**
 * detail fro a car with id
 * @type {string}
 */
function brandquery(brandName) {
  return 'query carListSearch {\n' +
    '  carList(\n' +
    '    search: "' + brandName + '"\n' +
    '    size: 100\n' +
    '  ) {\n' +
    '    id\n' +
    '    naming {\n' +
    '      make\n' +
    '      model\n' +
    '      version\n' +
    '    }\n' +
    '  }\n' +
    '}\n' +
    '';
}
function generateCarID(id) {
  return '{"carId":"' + id + '"}';
}


/**
 * handwritten graphQlRequest request with provided query
 * @param ourBody the query
 * @param xmlHeader info if the output should be xml
 * @param ourVariables variable if you want to change something in the query
 * @returns {Promise<string|any>} the response from chargetrip
 */
async function graphQLRequest(ourBody, xmlHeader, ourVariables) {
  let answer = await fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
      'x-app-id' : '62335e76c351300738296e32',
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

function checkcarid(id) {
  return typeof id === 'string';
}

/*
The HTTP GET method is used to **read** (or retrieve) a representation of a resource. In the “happy” (or non-error) path, GET returns a representation in XML or JSON and an HTTP response code of 200 (OK).
In an error case, it most often returns a 404 (NOT FOUND) or 400 (BAD REQUEST).
According to the design of the HTTP specification, GET (along with HEAD) requests are used only to read data and not change it. Therefore, when used this way, they are considered safe.
That is, they can be called without risk of data modification or corruption—calling it once has the same effect as calling it 10 times, or none at all.
Additionally, GET (and HEAD) is idempotent, which means that making multiple identical requests ends up having the same result as a single request.
Do not expose unsafe operations via GET—it should never modify any resources on the server.
*/

/**
 * sends a json of all know cars
 */
app.get('/getAllCars', async (req, res) => {
  res.send(await graphQLRequest(carListAll, req.headers.xml))
});

/**
 * sends details over one car back if id is valid, else status 400
 */
app.get('/getCarById', async (req, res) => {
  if (checkcarid(req.headers.id)) {
    res.send(await graphQLRequest(carID, req.headers.xml, generateCarID(req.headers.id)))
  } else {
    res.sendStatus(400)
  }
});

function checkBrand(brandString) {
  return (typeof brandString === "string")
}

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


/**
 * updates the car models based on brand name
 */
app.put('/getCarByBrand', async (req, res) => {
  if (req.headers.xml === "true") {
    res.send(await graphQLRequest(brandquery(req.headers.brand), req.headers.xml))

  } else if (checkBrand(req.headers.brand)) {
    const answer = await graphQLRequest(brandquery(req.headers.brand), req.headers.xml)

    if (isEmpty(answer) === true) {
      res.send("Sorry there were no matching results")

    } else {

      let models = [""], version = []

      //looping threw the answer
      for (let x in answer.data.carList) {

        // resting current array
        version = []
        // add version and id to local array
        version.push(answer.data.carList[x].naming.version)
        version.push(answer.data.carList[x].id)
        // add the new entry to the final array
        models.push( [answer.data.carList[x].naming.model, version])
      }
      // remove first element because it has to be declared because of my datastructures check
      models.shift()

      res.send(models)
    }
  }
})

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


/**
 * deletes the duplicates in brand-names returned from chargetrip
 */
app.delete('/getCarBrands', async (req, res) => {
  if(req.headers.xml === "true"){
    res.send(await graphQLRequest(carListAllBrands, req.headers.xml));
  }
  const duplicateModels = await graphQLRequest(carListAllBrands, req.headers.xml);
  // set the first element to the first car in response
  let noDuplicates = [duplicateModels.data.carList[0].naming.make]

  //loop threw data in response
  for (let currentModel in duplicateModels.data.carList) {
    // if new entry add it to response
    if (!(noDuplicates[noDuplicates.length - 1] === (duplicateModels.data.carList[currentModel].naming.make))) {
      noDuplicates.push(duplicateModels.data.carList[currentModel].naming.make)
    }
  }
  await res.send((noDuplicates));
})


module.exports = app


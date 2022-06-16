const express = require('express');
const https = require("https");
const {response} = require("express");
const xml = require('xml-js');
import fetch from 'node-fetch';

const options = {compact: true, ignoreComment: true, spaces: 4}
const app = express();
app.use(express.json());

function isEmpty(obj) {
  return Object.keys(obj.data.carList).length === 0
}

const carListAll = 'query carListAll {\n' +
  '  carList(size:407) {\n' +
  '    id\n' +
  '    connectors{standard}\n' +
  '    naming{\n' +
  '      model\n' +
  '      make\n' +
  '    }\n' +
  '  }}';

const carID = 'query car($carId: ID!) {\n' +
  '  car(id: $carId) {\n' +
  '    naming{\n' +
  '      make\n' +
  '    	model\n' +
  '    }\n' +
  '  }\n' +
  '}';

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
    '      edition\n' +
    '      chargetrip_version\n' +
    '    }\n' +
    '  }\n' +
    '}\n' +
    '';
}

function generateCarID(id) {
  return '{"carId":"' + id + '"}';
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

function checkcarid(id) {
  return typeof id === 'string';
}

app.get('/getAllCars', async (req, res) => {
  res.send(await graphQLRequest(carListAll, req.headers.xml))
});

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

app.get('/getCarByBrand', async (req, res) => {
  if (req.headers.xml === "true") {
    res.send(await graphQLRequest(brandquery(req.headers.brand), req.headers.xml))
  } else if (checkBrand(req.headers.brand)) {
    let answer = await graphQLRequest(brandquery(req.headers.brand), req.headers.xml)
    if (isEmpty(answer) === true) {
      res.send("Sorry there were no matching results")
    } else {
      res.send(answer)
    }
  }
})
module.exports = app


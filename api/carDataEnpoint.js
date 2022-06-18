import * as Console from "console";

const express = require('express');
const https = require("https");
const {response} = require("express");
const xml = require('xml-js');
import fetch from 'node-fetch';
import {config} from "@vue/test-utils";

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
  '      version\n' +
  '    }\n' +
  '  }}';

const carListAllBrands = 'query carListAll {\n' +
  '  carList(size:407) {\n' +
  '   naming {\n' +
  '      make\n' +
  '    }\n' +
  '  }}';


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


app.put('/getCarByBrand', async (req, res) => {
  if (req.headers.xml === "true") {
    console.log("headers:", req.headers)
    res.send(await graphQLRequest(brandquery(req.headers.brand), req.headers.xml))
  } else if (checkBrand(req.headers.brand)) {
    const answer = await graphQLRequest(brandquery(req.headers.brand), req.headers.xml)
    if (isEmpty(answer) === true) {
      res.send("Sorry there were no matching results")
    } else {
      let models =  [""], count = 1

      //console.log("answer : " , answer.data.carList)

      count = 0;
      for(let x in answer.data.carList){
        //console.log("models[count] : ", models[count][0])
        let version = []

        version.length = 0
        version.push(answer.data.carList[x].naming.version)
          version.push(answer.data.carList[x].id)
          let test = [answer.data.carList[x].naming.model, version]
          models.push(test)
          count +=1


      }
      const collection = [models]
      models.shift()
      //console.log("answer:", answer.data)
      res.send(models)
    }
  }
})

app.delete('/getCarBrands', async (req, res) => {
  const duplicateModels = await graphQLRequest(carListAllBrands, req.headers.xml);
  //console.log("duplicate Models.data: ", duplicateModels.data)
  let noDuplicates = ["Aiways"]
  for(let currentModel in duplicateModels.data.carList ){
    if(noDuplicates[noDuplicates.length-1] ===(duplicateModels.data.carList[currentModel].naming.make) ===false){
      noDuplicates.push(duplicateModels.data.carList[currentModel].naming.make)
    }
  }
  //console.log(JSON.stringify( noDuplicates))
   await res.send(( noDuplicates));
})


module.exports = app


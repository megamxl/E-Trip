const express = require('express');
const https = require("https");

const app = express();
app.use(express.json());


function fetch(qeury){
  fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    //body: JSON.stringify({query: 'query carListSearch {  carList(search: "Tesla") {    id    naming {     chargetrip_version      edition     make      model      version   }  }}',
    body: JSON.stringify({qeury,
      variables: { }})
  })
    .then(r => r.json()).then(data => console.log(data) );
}

app.get('/getChargerNearby', async (req,res) =>{



});

module.exports = app

const express = require('express');
const https = require("https");

const app = express();
app.use(express.json());


function test() {
  const https = require('https');
  require('dotenv').config();

  const data = JSON.stringify({
    query: `query carListSearch {
  carList(search: "Tesla") {
    id
    naming {
      chargetrip_version
      edition
      make
      model
      version
    }
    # add more fields here
  }
}`,
  });

  const options = {
    hostname: 'https://api.chargetrip.io/graphql', //path: '/api/example/__graphql',
     method: 'POST', headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length, //x-client-id'
      'x-client-id': '62335e76c351300738296e30 ' + process.env.STEPZEN_API_KEY,
      'User-Agent': 'Node',
    },
  };
  const req = https.request(options, (res) => {
    let data = '';
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', (d) => {
      data += d;
    });
    res.on('end', () => {
      console.log(JSON.parse(data).data);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
  /*
  const req = https.request(options, (res) => {
    let data = '';
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', (d) => {
      data += d;
    });
    res.on('end', () => {

      console.log(JSON.parse(data).data);
    });
  });

  req.on('error', (error) => {
    console.error(error);
  });



  req.write(data);
  req.end();

   */

}


function seconTry(){
  fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    body: JSON.stringify({query: 'query carListSearch {  carList(search: "Tesla") {    id    naming {     chargetrip_version      edition     make      model      version   }  }}',
      variables: { }})
  })
    .then(r => r.json()).then(data => console.log('data returned:', data));

}

app.post('/get', async (req, res) => {

  fetch('https://api.chargetrip.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-client-id': '62335e76c351300738296e30',
    },
    body: JSON.stringify({query: 'query carListSearch {  carList(search: "Tesla") {    id    naming {     chargetrip_version      edition     make      model      version   }  }}',
      variables: { }})
  })
    .then(r => r.json()).then(data => res.send(data) );


});


module.exports = app


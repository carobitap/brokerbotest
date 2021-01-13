const express = require('express');
const logger = require('morgan');
const bitso = require('bitso-node-api');
var app = express();

/*let client = new bitso {
    key: ''
    secret: ''
    authorizeMovements: true
}*/ 

//Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json()); 

//Balance
// Define your request
var key = "Bitso api key";
var secret = "Bitso api secret";
var httpMethod = "GET";
var request_path="/v3/balance/"
var json_payload={};

// Create the signature
var nonce = new Date().getTime();
var message = nonce+httpMethod+request_path;
var payload = JSON.stringify(json_payload)
if (httpMethod == "POST")
  message += payload;
var crypto = require('crypto');
var signature = crypto.createHmac('sha256', secret).update(message).digest('hex');

// Build the auth header
var authHeader = "Bitso "+key+":" +nonce+":"+signature;

// Send request
var options = {
  host: 'api.bitso.com',
  path: request_path,
  method: httpMethod,
  headers: {
    'Authorization': authHeader, //Bitso <key>:<nonce>:<signature>
    'Content-Type': 'application/json'
  }
};

// Send request
var http = require('https');
var req = http.request(options, function(res) {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`statusMessage: ${res.statusMessage}`);
  res.on('data', function (chunk) {
    console.log(`body: ${chunk}`);
  });
});
req.on('error', (error) => {
  console.error(error)
})
if (httpMethod == "POST") {
  req.write(payload);
}
req.end();

/*Buy
client.private.placeOrder({
    book: bitso.exchanges.BTC_MXN,
    side: 'buy',
    type: 'market',
    minor: '10000',
  })
    .then(res => console.log(res))
    .catch(err => console.log(err));
*/

//Starting server
app.listen(3000, function(err){ 
    if (err) console.log(err); 
    console.log(`Server on port ${3000}`); 
});
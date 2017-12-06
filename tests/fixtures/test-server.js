/* global __dirname process */

var express = require('express');
var http = require('http');
var ecstatic = require('ecstatic');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(ecstatic({ root: __dirname + '/../../' }));
app.use(bodyParser.json());

app.post('/post-test', respondToPostOrPut);
app.put('/put-test', respondToPostOrPut);
app.get('/get-test', respondToGet);

var server = http.createServer(app);
server.listen(8000);
console.error('Listening on :8000');

// Needed by test targets in Makefile.
console.log(process.pid);

function respondToPostOrPut(req, res) {
  if (req.body.postTest || req.body.putTest) {
    res.status(201).json({ test: 'ok' });
  } else {
    res.status(500).end();
  }
}

function respondToGet(req, res) {
  if (req.headers['accept'] === 'application/json') {
    res.status(200).json({ test: 'ok' });
  } else {
    res.status(500).end();
  }
}

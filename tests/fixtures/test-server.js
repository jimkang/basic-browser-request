var express = require('express');
var http = require('http');
var ecstatic = require('ecstatic');
var cors = require('cors');
var bodyParser = require('body-parser');
 
var app = express();
app.use(cors());
app.use(ecstatic({ root: __dirname + '/../../' }));
app.use(bodyParser.json());

app.post('/post-test', respondToPost);

var server = http.createServer(app);
server.listen(8000);
console.error('Listening on :8000');

// Needed by test targets in Makefile.
console.log(process.pid);

function respondToPost(req, res) {
  if (req.body.postTest) {
    res.json(201, {test: 'ok'});
  }
  else {
    res.end(500);
  }
}

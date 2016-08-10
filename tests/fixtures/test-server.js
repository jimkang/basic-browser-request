var express = require('express');
var http = require('http');
var ecstatic = require('ecstatic');
var cors = require('cors');
 
var app = express();
app.use(cors());
app.use(ecstatic({ root: __dirname + '/../../' }));

var server = http.createServer(app);
server.listen(8000);
console.error('Listening on :8000');

// Needed by test targets in Makefile.
console.log(process.pid);

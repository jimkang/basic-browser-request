var test = require('tape');
var makeRequest = require('../basicrequest');
var assertNoError = require('assert-no-error');

console.log(
  'An http server needs to be started at localhost:8000 for this test.'
);

test('Get chunks', chunkTest);

function chunkTest(t) {
  var chunksReceived = 0;
  var reqOpts = {
    url: 'http://localhost:8000/example/pg135.txt',
    method: 'GET',
    mimeType: 'text/plain',
    headers: {
      'X-hey': 'whatever'
    },
    onData: checkChunk
  };

  makeRequest(reqOpts, checkComplete);

  function checkChunk(data) {
    t.ok(data.length > 0, 'Data in chunk is not empty.');
    chunksReceived += 1;
  }

  function checkComplete(error, response, text) {
    assertNoError(t.ok, error, 'No error during request.');

    console.log(
      'Request completed! ' +
        chunksReceived +
        ' chunks received; ' +
        text.length +
        ' characters received.'
    );
    t.end();
  }
}

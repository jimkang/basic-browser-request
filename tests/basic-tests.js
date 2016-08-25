var test = require('tape');
var makeRequest = require('../basicrequest');
var assertNoError = require('assert-no-error');

console.log('An http server needs to be started at localhost:8000 for this test.');

test('Post test', postTest);

function postTest(t) {
  var reqOpts = {
    url: 'http://localhost:8000/post-test',
    method: 'POST',
    mimeType: 'application/json',
    body: {
      postTest: 'yes'
    }
  };

  makeRequest(reqOpts, checkComplete);

  function checkComplete(error, response, body) {
    assertNoError(t.ok, error, 'No error during request.');
    t.equal(body.test, 'ok', 'Received json body with test: ok.');
    t.end();
  }
}

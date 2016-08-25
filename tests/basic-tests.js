var test = require('tape');
var makeRequest = require('../basicrequest');
var assertNoError = require('assert-no-error');

console.log('An http server needs to be started at localhost:8000 for this test.');

var testCases = [
  {
    name: 'POST test',
    opts: {
      url: 'http://localhost:8000/post-test',
      method: 'POST',
      mimeType: 'application/json',
      body: {
        postTest: 'yes'
      }
    }
  },
  {
    name: 'PUT test',
    opts: {
      url: 'http://localhost:8000/put-test',
      method: 'PUT',
      mimeType: 'application/json',
      body: {
        putTest: 'yes'
      }
    }
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCase.name, basicTest);

  function basicTest(t) {
    makeRequest(testCase.opts, checkComplete);

    function checkComplete(error, response, body) {
      assertNoError(t.ok, error, 'No error during request.');
      t.equal(body.test, 'ok', 'Received json body with test: ok.');
      t.end();
    }
  }
}

var test = require('tape');
var makeRequest = require('../basicrequest');
var assertNoError = require('assert-no-error');

console.log(
  'An http server needs to be started at localhost:8000 for this test.'
);

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
    },
    expectedStatusCode: 201,
    expectedStatusMessage: 'Created'
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
    },
    expectedStatusCode: 201,
    expectedStatusMessage: 'Created'
  },
  {
    name: 'GET test',
    opts: {
      url: 'http://localhost:8000/get-test',
      method: 'GET',
      json: true
    },
    expectedStatusCode: 200,
    expectedStatusMessage: 'OK'
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
      t.equal(
        response.statusCode,
        testCase.expectedStatusCode,
        'Response has the correct status code.'
      );
      t.equal(
        response.statusMessage,
        testCase.expectedStatusMessage,
        'Response has the correct status message.'
      );
      t.ok(response.rawResponse, 'Response includes the raw xhr response.');
      t.equal(
        typeof response.xhr,
        'object',
        'Response includes the xhr object.'
      );
      t.end();
    }
  }
}

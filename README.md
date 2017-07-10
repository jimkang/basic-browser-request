basic-browser-request
=====================

Another lightweight wrapper around XHR that &mdash; according to me &mdash; does just enough. Supports chunking, canceling, and JSON.

Installation
------------

    npm install basic-browser-request

Usage
-----

    var requestHandle = requestMaker.makeRequest(
      {
        url: 'http://something.whatever/yeah',
        method: 'GET',
        mimeType: 'text/plain',
        onData: function onData(data) {
          console.log(data);
          chunksReceived += 1;
        }
      },
      done
    );

    function done(error, response, text) {
      if (error) {
        console.log(error);
      }
      else {
        useCompleteDownloadedText(text);
      }
    }

To cancel:

    requestHandle.cancelRequest();

If you don't specify a mimeType, it defaults to `application/json` and `done()` will be passed a parsed JSON object.

[Here's a working example.](http://jimkang.com/basic-browser-request/example)

In the interest of sort-of compatibility with [request](https://github.com/request/request), the callback will be passed three parameters:

- error: An error object, if there was an error while making the request.
- response: An object containing the `statusCode`, the `statusMessage` , `rawResponse`, and `xhr`: [XMLHttpRequest.response](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response). This is not at all the same as a [Node response](https://nodejs.org/api/http.html#http_class_http_serverresponse), though, so proceed with caution. The `xhr` is the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/) used to run the request operation.
- body: This is going to be a string or, if the mimeType was `application/json`, an object.

Tests
-----

Run in Chrome and Firefox with `make test`.

License
-------

MIT.

TODO
----

Add JSON test.

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

    function done(error, text) {
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

Tests
-----

TODO.

License
-------

MIT.

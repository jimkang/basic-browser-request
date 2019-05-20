function createRequestMaker() {
  // WARNING: onData does NOT work with binary data right now!

  function makeRequest(opts, done) {
    var jsonMode = opts.json || opts.mimeType === 'application/json';

    var xhr = new XMLHttpRequest();
    xhr.open(opts.method, opts.url);
    if (opts.mimeType) {
      xhr.setRequestHeader('content-type', opts.mimeType);
    }
    if (jsonMode) {
      xhr.setRequestHeader('accept', 'application/json');
    }

    if (typeof opts.headers === 'object') {
      for (var headerName in opts.headers) {
        xhr.setRequestHeader(headerName, opts.headers[headerName]);
      }
    }

    if (opts.binary) {
      xhr.responseType = 'arraybuffer';
    }

    if (jsonMode && typeof opts.body === 'object') {
      opts.body = JSON.stringify(opts.body);
    }

    var timeoutKey = null;

    xhr.onload = function requestDone() {
      clearTimeout(timeoutKey);

      if (opts.onData) {
        // Send out that last bit.
        emitNextChunk();
      }

      var responseObject = {
        statusCode: this.status,
        statusMessage: xhr.statusText,
        responseURL: xhr.responseURL,
        rawResponse: xhr.response,
        xhr: xhr
      };

      if (opts.binary) {
        done(null, responseObject, xhr.response);
      } else {
        var resultObject = this.responseText;
        if (jsonMode) {
          try {
            resultObject = JSON.parse(resultObject);
          } catch (e) {
            responseObject.jsonParseError = e;
          }
        }
        done(null, responseObject, resultObject);
      }
    };

    var lastReadIndex = 0;
    if (opts.onData) {
      xhr.onreadystatechange = stateChanged;
    }
    xhr.onerror = handleError;

    xhr.send(opts.formData || opts.body);

    if (opts.timeLimit > 0) {
      timeoutKey = setTimeout(cancelRequest, opts.timeLimit);
    }

    function cancelRequest() {
      xhr.abort();
      clearTimeout(timeoutKey);
      done();
    }

    function stateChanged() {
      if (xhr.readyState === 3) {
        emitNextChunk();
      }
    }

    function emitNextChunk() {
      if (xhr.responseText) {
        opts.onData(xhr.responseText.substr(lastReadIndex));
        lastReadIndex = xhr.responseText.length;
      }
    }

    // handleError is passed a progressEvent, but it has no useful information.
    function handleError() {
      var error = new Error('There is a problem with the network.');
      error.name = 'XHR network error';
      done(error);
    }

    return {
      url: opts.url,
      cancelRequest: cancelRequest
    };
  }

  return {
    makeRequest: makeRequest
  };
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  var requestMaker = createRequestMaker();
  module.exports = requestMaker.makeRequest;
}

function createRequestMaker() {
  // WARNING: onData does NOT work with binary data right now!

  function makeRequest(opts, done) {
    var jsonMode = (opts.json || opts.mimeType === 'application/json');

    var xhr = new XMLHttpRequest();
    xhr.open(opts.method,  opts.url);
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
      
      if (this.status >= 200 || this.status < 300) {
        var responseObject = {
          statusCode: this.status,
          statusMessage: xhr.statusText,
          rawResponse: xhr.response
        };

        if (opts.binary) {
          done(null, responseObject, xhr.response);
        }
        else {
          var resultObject = this.responseText;
          if (jsonMode) {
            resultObject = JSON.parse(resultObject);
          }
          done(null, responseObject, resultObject);
        }
      }
      else {
        done(new Error('Error while making request. XHR status: ' + this.status), xhr.response);
      }
    };

    var lastReadIndex = 0;
    if (opts.onData) {
      xhr.onreadystatechange = stateChanged;
    }
   
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
        opts.onData(this.responseText.substr(lastReadIndex));
        lastReadIndex = this.responseText.length;
      }
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

function createRequestMaker() {
  function makeRequest(opts, done) {
    opts = defaults(opts, {mimeType: 'application/json'});
    var jsonMode = (opts.mimeType === 'application/json');

    var xhr = new XMLHttpRequest();
    xhr.open(opts.method,  opts.url);
    if (opts.mimeType) {
      xhr.setRequestHeader('content-type', opts.mimeType);
    }
    else if (opts.method === 'GET') {
      xhr.setRequestHeader('accept', opts.mimeType);
    }

    if (typeof opts.headers === 'object') {
      for (var headerName in opts.headers) {
        xhr.setRequestHeader(headerName, opts.headers[headerName]);
      }
    }

    if (jsonMode && typeof opts.body === 'object') {
      opts.body = JSON.stringify(opts.body);
    }

    var timeoutKey = null;

    xhr.onload = function requestDone() {
      clearTimeout(timeoutKey);
      
      if (this.status >= 200 || this.status < 300) {
        var resultObject = this.responseText;
        if (jsonMode) {
          resultObject = JSON.parse(resultObject);
        }
        done(null, xhr.response, resultObject);
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
      done(new Error('Timed out'));
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

  // From Underscore, more or less.
  function defaults(obj, source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) {
          obj[prop] = source[prop];
        }
      }
    }
    return obj;
  }  

  return {
    makeRequest: makeRequest
  };
}

if (typeof module === 'object' && typeof module.exports === 'object') {
  var requestMaker = createRequestMaker();
  module.exports = requestMaker.makeRequest;
}

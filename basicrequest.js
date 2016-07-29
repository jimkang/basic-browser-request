function createRequestMaker() {
  function makeRequest(opts, done) {
    opts = defaults(opts, {mimeType: 'application/json'});

    var xhr = new XMLHttpRequest();
    xhr.open(opts.method,  opts.url);
    if (opts.method === 'POST') {
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

    var timeoutKey = null;

    xhr.onload = function requestDone() {
      clearTimeout(timeoutKey);
      
      if (this.status === 200) {

        var resultObject = this.responseText;
        if (opts.mimeType === 'application/json') {
          resultObject = JSON.parse(resultObject);
        }
        done(null, resultObject);
      }
      else {
        done(new Error('Error while making request. XHR status: ' + this.status));
      }
    };

    var lastReadIndex = 0;
    if (opts.onData) {
      xhr.onreadystatechange = stateChanged;
    }
   
    xhr.send(opts.method === 'POST' ? (opts.formData || opts.body) : undefined);

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

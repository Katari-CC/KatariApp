// QUICK FIX TO UPLOAD IMAGE
const self = (function(self) {
  "use strict";

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        headers.append(key, value);
      }
    });
    return headers;
  }

  var supportsBlob =
    "FileReader" in self &&
    "Blob" in self &&
    (function() {
      try {
        new Blob();
        return true;
      } catch (e) {
        return false;
      }
    })();

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || ""),
        };
        options.url =
          "responseURL" in xhr
            ? xhr.responseURL
            : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError("Network request failed"));
      };

      xhr.ontimeout = function() {
        reject(new TypeError("Network request failed"));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }
      if ("responseType" in xhr && supportsBlob) {
        xhr.responseType = "blob";
      }
      (request.headers || []).forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(
        typeof request._bodyInit === "undefined" ? null : request._bodyInit
      );
    });
  };
  self.fetch.polyfill = true;
})(typeof self !== "undefined" ? self : this);

export default self;

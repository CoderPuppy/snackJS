(function(snack, $) {
  function StringifyParams(params) {
    var nameData;
    return $.map(params, function(d, n) {
      switch($.type(d)) {
        case "boolean":
          nameData = (d ? 'true' : 'false');
          break;
        case "number":
          nameData = d + "";
          break;
        case "date":
          nameData = d.getTime();
          break;
        case "function":
          nameData = d.toString();
          break;
        case "string":
          nameData = d;
          break;
        case "undefined":
          nameData = "undefined";
          break;
        case "object":
        case "array":
        case "nodelist":
        case "element":
        case "regexp":
        case "window":
        default:
          nameData = JSON.stringify(d);
          break;
      }
      return nameData;
    });
  }
  function GetifyParams(params) {
    var serializedParams = new Array();
    $.each(params, function(v, n) {
      serializedParams.push(encodeURIComponent(n) + "=" + encodeURIComponent(v));
    });
    return serializedParams.join("&");
  }

  Array.prototype.removeEl = function(el) {
    var idx = this.indexOf(el); // Find the index
    var rtn = this[idx];
    if(idx!=-1) this.splice(idx, 1); // Remove it if really found!
    return rtn;
  }
  $.extend($._internal, {
    xhr: (function() {
      function xhr(handler) {
        try {
          this._xhr = new ActiveXObject('Msxml2.XMLHTTP');
        } catch(e1) {
          try {
            this._xhr = new ActiveXOjbect('Microsoft.XMLHTTP');
          } catch(e2) {
            try {
              this._xhr = new XMLHttpRequest();
            } catch(e3) {
              return undefined;
            }
          }
        }
        this._handler = handler;
      }
      xhr.prototype.open = function(url, method, params, async) {
        var self = this;
        this._xhr.open(method.toUpperCase(), url, async);
        this._xhr.onreadystatechange = function() {
          self._handler.call(self, {
            readyState: self._xhr.readyState,
            status: self._xhr.status,
            response: {
              text: self._xhr.responseText,
              xml: self._xhr.responseXml
            }
          })
        };
        this._xhr.send(params);
      }
    
      return xhr;
    })()
  });
  var defaultoptions = {
    ajax: {
      url: "http://www.google.com/",
      method: 'get',
      params: {},
      async: true,
      onReady: function(res) {
        console.log(res);
      }
    }
  }
  $.extend({
    ajax: function(url, ioptions) {
      var options = $.copy(defaultoptions.ajax);
      if(ioptions) {
        $.extend(options, ioptions);
      }
      

      return (new $.XHR()).open(url, options);
    },
    XHR: (function() {
      function XHR(url, options) {
        this.options = options;
        this.url = url;
      }
      XHR.prototype.open = function() {
        var url = this.url, options = this.options;
        if(url.indexOf("?") == -1) {
          url = url + "?" + GetifyParams(StringifyParams(options.params));
        } else {
          if(url.charAt(url.length-1) !== "&") url = url + "&"
          url = url + GetifyParams(StringifyParams(options.params));
        }
        options.url = url;
        var self = this;
        var xhr = new $._internal.xhr(function(response) {
          var data, resData = response.response;
          console.log(response);
          if(response.readyState == 4 && response.status == 200)
            switch(this.options.type) {
              case "json":
                data = JSON.parse(resData.text);
                break;
              case "text":
              default:
                data = resData.text;
            }
          self.options.onReady.call(response.response)
        });
        xhr.open(options.url, options.method, options.params, options.async);

        return this;
      }
      return XHR;
    })()
  });
})(window.snack, window.$);
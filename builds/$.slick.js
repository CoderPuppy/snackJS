/* $.js written by Drew Young
* Includes slick, snackJs' core.js and ready function,
* parts of jQuery and stuff from random places online
*/
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(searchElement /*, fromIndex */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0)
      return -1;

    var n = 0;
    if (arguments.length > 0)
    {
      n = Number(arguments[1]);
      if (n !== n) // shortcut for verifying if it's NaN
        n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0))
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }

    if (n >= len)
      return -1;

    var k = n >= 0
          ? n
          : Math.max(len - Math.abs(n), 0);

    for (; k < len; k++)
    {
      if (k in t && t[k] === searchElement)
        return k;
    }
    return -1;
  };
}
if (!Array.prototype.every)
{
  Array.prototype.every = function(fun /*, thisp */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in t && !fun.call(thisp, t[i], i, t))
        return false;
    }

    return true;
  };
}

/*
http://www.JSON.org/json2.js
2010-11-17

Public Domain.

NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

See http://www.JSON.org/js.html


This code should be minified before deployment.
See http://javascript.crockford.com/jsmin.html

USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
NOT CONTROL.


This file creates a global JSON object containing two methods: stringify
and parse.

JSON.stringify(value, replacer, space)
value any JavaScript value, usually an object or array.

replacer an optional parameter that determines how object
values are stringified for objects. It can be a
function or an array of strings.

space an optional parameter that specifies the indentation
of nested structures. If it is omitted, the text will
be packed without extra whitespace. If it is a number,
it will specify the number of spaces to indent at each
level. If it is a string (such as '\t' or '&nbsp;'),
it contains the characters used to indent at each level.

This method produces a JSON text from a JavaScript value.

When an object value is found, if the object contains a toJSON
method, its toJSON method will be called and the result will be
stringified. A toJSON method does not serialize: it returns the
value represented by the name/value pair that should be serialized,
or undefined if nothing should be serialized. The toJSON method
will be passed the key associated with the value, and this will be
bound to the value

For example, this would serialize Dates as ISO strings.

Date.prototype.toJSON = function (key) {
function f(n) {
// Format integers to have at least two digits.
return n < 10 ? '0' + n : n;
}

return this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) + 'Z';
};

You can provide an optional replacer method. It will be passed the
key and value of each member, with this bound to the containing
object. The value that is returned from your method will be
serialized. If your method returns undefined, then the member will
be excluded from the serialization.

If the replacer parameter is an array of strings, then it will be
used to select the members to be serialized. It filters the results
such that only members with keys listed in the replacer array are
stringified.

Values that do not have JSON representations, such as undefined or
functions, will not be serialized. Such values in objects will be
dropped; in arrays they will be replaced with null. You can use
a replacer function to replace those with JSON values.
JSON.stringify(undefined) returns undefined.

The optional space parameter produces a stringification of the
value that is filled with line breaks and indentation to make it
easier to read.

If the space parameter is a non-empty string, then that string will
be used for indentation. If the space parameter is a number, then
the indentation will be that many spaces.

Example:

text = JSON.stringify(['e', {pluribus: 'unum'}]);
// text is '["e",{"pluribus":"unum"}]'


text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
// text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

text = JSON.stringify([new Date()], function (key, value) {
return this[key] instanceof Date ?
'Date(' + this[key] + ')' : value;
});
// text is '["Date(---current time---)"]'


JSON.parse(text, reviver)
This method parses a JSON text to produce an object or array.
It can throw a SyntaxError exception.

The optional reviver parameter is a function that can filter and
transform the results. It receives each of the keys and values,
and its return value is used instead of the original value.
If it returns what it received, then the structure is not modified.
If it returns undefined then the member is deleted.

Example:

// Parse the text. Values that look like ISO date strings will
// be converted to Date objects.

myData = JSON.parse(text, function (key, value) {
var a;
if (typeof value === 'string') {
a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
if (a) {
return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
+a[5], +a[6]));
}
}
return value;
});

myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
var d;
if (typeof value === 'string' &&
value.slice(0, 5) === 'Date(' &&
value.slice(-1) === ')') {
d = new Date(value.slice(5, -1));
if (d) {
return d;
}
}
return value;
});


This is a reference implementation. You are free to copy, modify, or
redistribute.
*/

/*jslint evil: true, strict: false, regexp: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
lastIndex, length, parse, prototype, push, replace, slice, stringify,
test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
    "use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    //if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
            if (/^[\],:{}\s()]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    //}
}());
/*!
  * snack.js (c) Ryan Florence
  * https://github.com/rpflorence/snack
  * MIT License
  * Inspiration and code adapted from
  *  MooTools      (c) Valerio Proietti   MIT license
  *  jQuery        (c) John Resig         Dual license MIT or GPL Version 2
  *  contentLoaded (c) Diego Perini       MIT License
  *  Zepto.js      (c) Thomas Fuchs       MIT License
*/

if (typeof Object.create != 'function'){
  // ES5 Obeject.create
  Object.create = function (o){
    function F() {}
    F.prototype = o;
    return new F;
  };
}

!function(window, document){
  var snack = window.snack = {}
  , guid = 0
  , toString = Object.prototype.toString
  , indexOf = Array.prototype.indexOf
  , readyHandlers = []
  , ready = false
  , remove = document.addEventListener ? 'removeEventListener' : 'detachEvent'
  , prefix = document.addEventListener ? '' : 'on'
  ,add = document.addEventListener ? 'addEventListener' : 'attachEvent';

  snack.extend = function (){
    if (arguments.length == 1)
      return snack.extend(snack, arguments[0]);

    var target = arguments[0];

    for (var i = 1, l = arguments.length; i < l; i++)
      for (key in arguments[i])
        target[key] = arguments[i][key];

    return target;
  }

  snack.extend({
    v: '1.2.0',

    bind: function (fn, context, args) {
      return function (){
        return fn.apply(context, args || arguments);
      };
    },

    punch: function (obj, method, fn, auto){
      var old = obj[method];
      obj[method] = auto ? function (){
        old.apply(obj, arguments);
        return fn.apply(obj, arguments);
      } : function (){
        var args = [].slice.call(arguments, 0);
        args.unshift(snack.bind(old, obj));
        return fn.apply(obj, args);
      }
    },

    create: function (proto, ext){
      var obj = Object.create(proto);
      if (!ext)
        return obj;

      for (i in ext) {
        if (!ext.hasOwnProperty(i))
          continue;

        if (!proto[i] || typeof ext[i] != 'function'){
          obj[i] = ext[i];
          continue;
        }

        snack.punch(obj, i, ext[i]);
      }

      return obj;
    },

    id: function (){
      return ++guid;
    },

    each: function (obj, fn, context){
      if (obj.length === void+0){ // loose check for object, we want array-like objects to be treated as arrays
        for (var key in obj)
          if (obj.hasOwnProperty(key))
            fn.call(context, obj[key], key, obj);
        return obj;
      }

      for (var i = 0, l = obj.length; i < l; i++)
        fn.call(context, obj[i], i, obj);
      return obj;
    },

    parseJSON: function(json) {
      // adapted from jQuery
      if (typeof json != 'string')
        return;

      json = json.replace(/^\s+|\s+$/g, '');

      var isValid = /^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));

      if (!isValid)
        throw "Invalid JSON";

      var JSON = window.JSON; // saves a couple bytes
      return JSON && JSON.parse ? JSON.parse(json) : (new Function("return " + json))();
    },

    isArray: function (obj){
      return obj instanceof Array || toString.call(obj) == "[object Array]";
    },

    indexOf: indexOf ? function(item, array){
      return indexOf.call(array, item);
    } : function (item, array){
      for (var i = 0, l = array.length; i < l; i++)
        if (array[i] === item)
          return i;

      return -1;
    }
  });

  snack.ready = function (handler){
    if (ready){
      handler.apply(document);
      return;
    }
    readyHandlers.push(handler);
  };
  // adapted from contentloaded
  function init(e) {
    if (e.type == 'readystatechange' && document.readyState != 'complete')
      return;

    (e.type == 'load' ? window : document)[remove](prefix + e.type, init, false);

    if (!ready && (ready = true))
      snack.each(readyHandlers, function (handler){
        handler.apply(document);
      });
  }

  document[add](prefix + 'DOMContentLoaded', init, false);
  document[add](prefix + 'readystatechange', init, false);
  window[add](prefix + 'load', init, false);
}(window, document);

(function(snack) {
  var class2type = {}, trim = String.prototype.trim,
  rspace = /\s+/,
  rclass = /[\n\t\r]/g,
  toString = Object.prototype.toString,
  push = Array.prototype.push,
  defaultOptions = {
    props: {
      getter: "attr",
      getParams: function(prop, val) {
        return $.isDefined(val)?[prop, val]:[prop];
      }
    }
  };

  function html(string) {
    if(string.indexOf("<") !== -1 &&
      string.indexOf('>') !== -1 &&
      string.length >= 3) { // maybe should do more tests
      return true;
    } else { // not html
      return false;
    }
  }

  function fireEvent(element,event){
    var evt;
    if (document.createEventObject){
      // dispatch for IE
      evt = document.createEventObject();
      return element.fireEvent('on'+event,evt);
    } else {
      // dispatch for firefox + others
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true ); // event type,bubbling,cancelable
      return !element.dispatchEvent(evt);
    }
  }
  function attrReplace(string) {
    return (string.replace(/\_/g, "-")).replace(/(A-Z)/g, function(all, upper) {
      return "-" + upper.toLowerCase();
    });
  }
  snack.each("Boolean Undefined Number String Function Array Date RegExp Object NodeList Window HTMLCollection Text".split(" "), function(name) {
    class2type["[object " + name + "]"] = name.toLowerCase();
  });

  function typeOf(obj) {
    var type = toString.call(obj);
    //console.log(type);
    if((new RegExp('[object .*"Element".*]]')).test(type) && !class2type[type]) {
      return "element";
    }
    return obj == null ? String(obj) : class2type[type] || "object";
  }
  function toArray(literal) {
    var arrayObject = new Array();
    for(var i = 0; i < literal.length; i++) {
      arrayObject.push(literal[i]);
    }
    return arrayObject;
  }
  
  function camelCase(string) {
    string.replace(/[-_](a-z)/ig, function(all, character) {
      return character.toUpperCase();
    });
    return string;
  }
  
  function isElementArray(array) {
    array = toArray(array);
    return array.every(function(el) {
      return $.isA(el, "element", "text");
    });
  }

  var $ = function(selector, context) {
    var type = typeOf(selector);
    context = context === undefined ? document : context;
    if((type == "element" || type == "text") || ((type == "array" || type == "nodelist") && isElementArray(selector))) {
      return new $.fn(selector, "", context);
    } else {
      if(selector instanceof $.fn) {
        return selector;
      } else {
        if(type == "string") {
          if(html(selector)) { // use $.create
            return $.create(selector);
          } else {
            return new $.fn($._internal.selector.query(selector, context), selector, context);
          }
        } else {
          throw "Invalid parameter: selector";
        }
      }
    }
  };
  var functionName = /function\s*(.*)\((.*)\)\s*\{/i;

  function getElementsToAdd(element) {
    var whatsToAdd = new Array(), type = typeOf(element);
    if(type == "element" || type == "text") {
      whatsToAdd = [element];
    } else {
      if(element instanceof $.fn) {
        whatsToAdd = element.get();
      } else {
        if(type == "nodelist" || type == "array") {
          whatsToAdd = element;
        } else {
          return 'html';
        }
      }
    }
    
    return whatsToAdd;
  }

  snack.extend($, {
    nth: function( cur, result, dir, elem, args ) {
      result = result || 1;
      var num = 0;

      for ( ; cur; cur = $.getProp(cur, dir, args) ) {
        if ( cur.nodeType === 1 && ++num === result ) {
          break;
        }
      }

      return cur;
    },
    equal: function(first, second) {
      var ftype = typeOf(first), stype = typeOf(second), good;
      if(ftype != stype) return false;
      if(first instanceof $.fn && second instanceof $.fn) {
        good = $.equal(first.get(), second.get());
      } else {
        switch(ftype) {
          case "element":
            good = $(first).id() == $(second).id() && $(first).classes() == $(second).classes();
            break;
          case "date":
            good = first.getTime() == second.getTime();
            break;
          case "nodelist":
          case "array":
          case "object":
            good = true;
            $.each(first, function(v, i) {
              if(!(second[i] && $.equal(v, second[i]))) good = false;
            });
            break;
          case "htmlcollection":
          case "window":
          case "boolean":
          case "number":
          case "string":
          default:
            good = (first == second);
            break;
        }
      }
      
      return good;
    },
    sibling: function(n, elem) {
      var r = [];
      
      for(; n; n = n.nextSibling) {
        if(n.nodeType === 1 && n !== elem) {
          r.push(n);
        }
      }
      
      return r;
    },
    unique: function(array) {
      array = toArray(array);
      var has = {}, i = array.length - 1;
      for(; i >= 0; i--) {
        if(has[array[i]]) {
          array.splice(i, 1);
        } else {
          has[array[i]] = true;
        }
      }
      
      return array;
    },
    inObj: function(thing, obj) {
      return ((obj && thing) ? ((obj.indexOf) ? obj.indexOf(thing) !== -1 : typeof obj[thing] !== undefined) : false);
    },
    setEngine: function(engine) {
      if(engine && engine.query && $.isFunction(engine.query) && engine.filter && $.isFunction(engine.filter) && $.isFunction(engine.addPseudo)) {
        $._internal.selector = engine;
      }
    },
    filter: function(type, callback, array, not, wrap) {
      var rtnData;
      if(typeOf(type) != "string") {
        wrap = not;
        not = array;
        array = callback;
        callback = type;
        type = 'array';
      }
      if(!not) {
        not = false;
      }
      if(!wrap) {
        wrap = true;
      }
      switch(type) {
        case 'css':
          var res = $._internal.filter(callback, array, not);
          rtnData = wrap ? $(res) : res;
          break;
        case 'array':
          $.each(array, function(o, i) {
            if(!(not ? !callback(o,i) : callback(o,i)))
              array.slice(i, 1);
          });
          break;
        case 'object':
        default:
          $.each(array, function(o, i) {
            if(!(not ? !callback(o,i) : callback(o,i)))
              delete array[i];
          });
          break;
      }
      
      return rtnData;
    },
    // jQuery's map function
    map: function( elems, callback, arg ) {
      var value, key, ret = [],
      i = 0,
      length = elems.length,
      // $ objects are treated as arrays
      isArray = elems instanceof $.fn || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

      // Go through the array, translating each of the items to their
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null ) {
            ret[ ret.length ] = value;
          }
        }

        // Flatten any nested arrays
        return ret.concat.apply( [], ret );
        
      // Go through every key on the object,
      } else {
        ret = {};
        for ( key in elems ) {
          value = callback( elems[ key ], key, arg );

          if ( value != null ) {
            ret[ key ] = value;
          }
        }

        return ret;
      }

    },
    // jQuery's dir function
    dir: function( elem, dir, until, args ) {
      var matched = [],
      cur = elem[ dir ];

      while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !$( cur ).is( $(until) )) ) {
        if ( cur.nodeType === 1 ) {
          matched.push( cur );
        }
        cur = $.getProp(cur, dir, args);
      }
      return matched;
    },
    isA: function(o) {
      var type = typeOf(o), i = 1;
      for(; i < arguments.length; i++) {
        if(type == arguments[i]) return true;
      }

      return false;
    },
    getProp: function(objs, prop, args) {
      var getter = function(obj) {
        if(typeOf(obj[prop]) == "function") {
          return obj[prop].apply(obj, args);
        }
        return obj[prop];
      }, tests = new Array(), thisOne, rtnData;
      if(typeOf(prop) == "function") getter = prop;
      if($.isA(objs, "array", "nodelist")) {
        $.each(objs, function(o, i) {
          if($.isString(prop)) thisOne = $.isDefined(o[prop]);
          else thisOne = $.isDefined(tests[tests.push(getter(o))-1]);
          if(thisOne) {
            rtnData = getter.apply(o, [o].concat(args));

            return false;
          }
        });
      } else {
        rtnData = getter.apply(objs, [objs].concat(args));
      }

      return rtnData;
    },
    // clone any object basically
    copy: function(object) {
      var rtnData = null;
      if(object instanceof $.fn) {
        rtnData = $($.copy(object.get()), object.context);
      } else {
        switch(typeOf(object)) {
          case "object":
            rtnData = {};
            for(prop in object) {
              rtnData[prop] = $.copy(object[prop]);
            }
            break;
          case "function":
            var funcName = functionName.test(object.toString())[0];
            if(funcName) {
              rtnData = eval("(function() {"+object.toString()+"return " + funcName + ";})();");
            } else {
              rtnData = eval(object.toString())
            }
            break;
          case "date":
            rtnData = new Date(object.getTime());
            break;
          case "regexp":
            rtnData = new RegExp(object.toString().split("/")[1], object.toString().split("/")[2])
            break;
          case "array":
            rtnData = new Array(object.length);
            for(var i = 0; i < object.length; i++) {
              rtnData[i] = $.copy(object[i]);
            }
            break;
          case "element":
            rtnData = object.cloneNode(true);
            break;
          case "nodelist":
            var fragment = document.createDocumentFragment();
            $.each(object, function(node) {
              fragment.appendChild($.copy(node));
            });
            rtnData = fragment.childNodes;
            break;
          case "text":
            rtnData = document.createTextNode(object.textContent);
            break;
          case "undefined":
            rtnData = undefined;
            break;
          case "window":
          case "string":
          case "number":
          case "boolean":
          case "htmlcollection":
          default:
            rtnData = object;
            break;
        }
      }

      return rtnData;
    },
    // ready event uses snack.ready
    ready: function(fn) {
      snack.ready(fn);
      
      return $(document);
    },
    attrFn: {},
    trim: trim ? function( text ) {
      return text == null ?
      "" :
      trim.call( text );
    } : function( text ) {
      return text == null ?
      "" :
      text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
    },
    type: typeOf,
    // isXXX
    isString: function(thing) {
      return typeOf(thing) == "string";
    },
    isNodelist: function(thing) {
      return typeOf(thing) == "nodelist";
    },
    isElement: function(thing) {
      return typeOf(thing) == "element";
    },
    isArray: function(thing) {
      return typeOf(thing) == "array";
    },
    isObject: function(thing) {
      return typeOf(thing) == "object";
    },
    isFunction: function(thing) {
      return typeOf(thing) == "function";
    },
    isUndefined: function(thing) {
      return typeOf(thing) == "undefined";
    },
    isDefined: function(thing) {
      return !$.isUndefined(thing);
    },
    // extend stuff
    extend: function(obj, extender) {
      return (extender ? snack.extend(obj, extender) : snack.extend($, obj));
    },
    // publisher for events and such
    publisher: function() {
      return snack.publisher.apply(snack, arguments);
    },
    // fn: the main thing wrapper for elements
    fn: (function() {
      function fn(selector, string, context) {
        var els;
        this.selector = string;
        if($.isArray(selector) || $.isNodelist(selector)) {
          els = selector;
        } else {
          els = [selector];
        }
        $.each(els, function(el) {
          if(context) {
            function ANotherLevel(otherel) {
              if(otherel && otherel.parentNode && otherel.parentNode != context) {
                ANotherLevel(otherel.parentNode);
              } else {
                return;
              }
            }
            ANotherLevel(el);
          } else {
            if(el && el.parentNode)
              context = el.parentNode;
          }
        });
        this.context = context || document;
        for(var i = 0; i < els.length; i++) {
          push.call(this, els[i]);
        }

      //return this;
      }
      fn.define = function(name, fn){
        if (typeof name != 'string'){
          for (i in name)
            $.fn.define(i, name[i])
          return
        }
        $.fn.prototype[name] = fn;
      }
      
      return fn;
    })(),
    // internal stuff such as the selector which is there though not used much
    _internal: {
      selector: {
        query: function(selector, context, results) {
          if(typeof context == "string")
            context = Sizzle(context)[0];
          return Sizzle(selector, context || document, results);
        },
        filter: function(selector, elems, not) {
          return Sizzle.matches(":not(" + selector + ")", elems);
        },
        addPseudo: function(name, func) {
          Sizzle.selectors[name] = func;
        }
      }
    },
    // make a html string into a nodelist
    createNodeList: function(elem) {
      var rleadingWhitespace = /^\s+/,
      rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
      rtagName = /<([\w:]+)/,
      rtbody = /<tbody/i,
      rhtml = /<|&#?\w+;/,
      wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        area: [ 1, "<map>", "</map>" ],
        _default: [ 0, "", "" ]
      },
      context = document;
      if ( !rhtml.test( elem ) ) {
        elem = context.createTextNode( elem );
      } else {
        // Fix "XHTML"-style tags in all browsers
        elem = elem.replace(rxhtmlTag, "<$1></$2>");

        // Trim whitespace, otherwise indexOf won't work as expected
        var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
        wrap = wrapMap[ tag ] || wrapMap._default,
        depth = wrap[0],
        div = context.createElement("div");

        // Go to html and back, then peel off extra wrappers
        div.innerHTML = wrap[1] + elem + wrap[2];

        // Move to the right depth
        while ( depth-- ) {
          div = div.lastChild;
        }

        // Remove IE's autoinserted <tbody> from table fragments
        if ( !$.support.tbody ) {

          // String was a <table>, *may* have spurious <tbody>
          var hasBody = rtbody.test(elem),
          tbody = tag === "table" && !hasBody ?
          div.firstChild && div.firstChild.childNodes :

          // String was a bare <thead> or <tfoot>
          wrap[1] === "<table>" && !hasBody ?
          div.childNodes :
          [];

          for ( var j = tbody.length - 1; j >= 0 ; --j ) {
            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
              tbody[ j ].parentNode.removeChild( tbody[ j ] );
            }
          }
        }

        // IE completely kills leading whitespace when innerHTML is used
        if ( !$.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
          div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
        }

        elem = div.childNodes;
      }
      return elem;
    },
    // wrapper around createNodeList instead of nodelist returns $.fn instance
    create: function(elem) {
      return $($.createNodeList(elem));
    },
    // jQuery's each function
    each: function(object, callback, args) {
      var name, i = 0,
      length = object.length,
      isObj = length === undefined || $.isFunction( object );

      if ( args ) {
        if ( isObj ) {
          for ( name in object ) {
            if ( callback.apply( object[ name ], args ) === false ) {
              break;
            }
          }
        } else {
          for ( ; i < length; ) {
            if ( callback.apply( object[ i++ ], args ) === false ) {
              break;
            }
          }
        }

      // A special, fast, case for the most common use of each
      } else {
        if ( isObj ) {
          for ( name in object ) {
            if ( callback.call( object[ name ], object[ name ], name ) === false ) {
              break;
            }
          }
        } else {
          for ( ; i < length; ) {
            if ( callback.call( object[ i ], object[ i++ ], i ) === false ) {
              break;
            }
          }
        }
      }

      return object;

    }
  });
  $.fn.define({
    // events
    fire: function(event, evt) {
      this.each(function() {
        fireEvent(this, event);
      })
      return this;
    },
    bind: function(evt, func) {
      if(window.attachEvent) {
        this.each(function() {
          this.attachEvent(evt, func);
        });
      } else {
        this.each(function() {
          this.addEventListener(evt, func, false);
        });
      }
    },
    // toXxxxx
    toString: function() {
      var string = "$(", els = this.get();
      string += els.join(', ');
      string += ')'
      return string;
    },
    toArray: function() {
      return Array.prototype.slice.call(this, 0);
    },
    // dom
    prepend: function(element) {
      var whatsToAdd = getElementsToAdd(element);
      if(whatsToAdd == "html") {
        whatsToAdd = getElementsToAdd($.createNodeList(element));
      }
      this.each(function(el) {
        console.log(el)
        var thisEl = el;
        for(var i = whatsToAdd.length - 1; i >= 0; i--) {
          console.log($.copy(whatsToAdd[i]), thisEl.firstChild);
          thisEl.insertBefore($.copy(whatsToAdd[i]), thisEl.firstChild);
        }
      });

      return this;
    },
    val: function(value) {
      if(value) {
        return this[0].value || undefined;
      } else {
        this.each(function() {
          this.value = value;
        });
        
        return this;
      }
    },
    removeData: function(name) {
      this.each(function() {
        this.removeAttribute(attrReplace(name));
      });
      
      return this;
    },
    data: function(name, value) {
      if(value) {
        this.each(function() {
          this.setAttribute("data:" + attrReplace(name), JSON.stringify(value));
        });
        return this;
      } else {
        return JSON.parse(this.get(0).getAttribute("data:" + attrReplace(name)));
      }
    },
    attr: function(attr, val) {
      if(val) {
        this.each(function(el) {
          el.setAttribute(attr, val);
        });
        return this;
      } else {
        if($.isObject(attr)) {
          $.each(attr, function(v, i) {
            this.attr(i, v);
          });

          return this;
        } else {
          return $.getProp(this.get(), 'getAttribute', [attr]);
        }
      }
    },
    each: function(callback, context) {
      return $.each(this, callback, context);
    },
    append: function(element) {
      var whatsToAdd = getElementsToAdd(element);
      if(whatsToAdd == "html") {
        whatsToAdd = getElementsToAdd(this, $.createNodeList(element));
      }
      this.each(function(el) {
        var thisEl = el;
        $.each(whatsToAdd, function(appendel) {
          thisEl.appendChild(appendel);
        });
      });

      return this;
    },
    // css
    hasClass: function(theClass) {
      var has = true;
      this.each(function(el) {
        if(!((new RegExp(theClass)).test(el.className))) {
          has = false;
        }
      });
      
      return has;
    },
    removeClass: function(value) {
      var classNames = (value || "").split( rspace );

      for ( var i = 0, l = this.length; i < l; i++ ) {
        var elem = this[i];

        if ( elem.nodeType === 1 && elem.className ) {
          if ( value ) {
            var className = (" " + elem.className + " ").replace(rclass, " ");
            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
              className = className.replace(" " + classNames[c] + " ", " ");
            }
            elem.className = $.trim( className );

          } else {
            elem.className = "";
          }
        }
      }
      
      return this;
    },
    addClass: function(value) {
      var classNames = (value || "").split( rspace );

      for ( var i = 0, l = this.length; i < l; i++ ) {
        var elem = this[i];

        if ( elem.nodeType === 1 ) {
          if ( !elem.className ) {
            elem.className = value;

          } else {
            var className = " " + elem.className + " ",
            setClass = elem.className;

            for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
                setClass += " " + classNames[c];
              }
            }
            elem.className = $.trim( setClass );
          }
        }
      }
      
      return this;
    },
    css: function(prop, val) {
      if(val) {
        this.each(function(el) {
          if(typeOf(el) == "element")
            el.style[camelCase(prop)] = val;
        });
      } else {
        if(typeOf(prop) == "object") {
          var self = this;
          $.each(prop, function(rule, index) {
            self.each(function(el) {
              if(typeOf(el) == "element")
                el.style[camelCase(index)] = rule;
            });
          })
        } else {
          return this[0].style[camelCase(prop)];
        }
      }
      return this;
    },
    // selection
    not: function(selector) {
      return $.filter('css', selector, this.get(), true);
    },
    children: function(selector) {
      var children = new Array();
      this.each(function() {
        children.concat(this.childNodes);
      });
      
      if(selector) {
        return $.filter('css', selector, false);
      } else {
        return $(children);
      }
    },
    find: function(selector) {
      if($.isString(selector)) {
        var found = new Array();
        this.each(function() {
          found.concat(Sizzle(selector, this));
        });
        return $(found);
      } else {
        return this;
      }
    },
    get: function(which) {
      var ourEls = this.toArray();
      if(typeOf(which) != "undefined") {
        return ourEls[which];
      } else {
        return ourEls;
      }
    },
    // misc
    text: function(val) {
      if($.isDefined(val)) {
        return this.append(document.createTextNode(val));
      } else {
        var rtnData;
        this.each(function(el) {
          if($.isDefined(el.innerText)) rtnData = el.innerText;
          else if($.isDefined(el.textContent)) rtnData = el.textContent;
          else return true;
        });
        return rtnData;
      }
    },
    html: function(val) {
      if($.isDefined(val)) {
        return this.append(document.createTextNode(val));
      } else {
        var rtnData;
        this.each(function(el) {
          if($.isDefined(el.innerText)) rtnData = el.innerText;
          else if($.isDefined(el.textContent)) rtnData = el.textContent;
          else return true;
        });

        return rtnData;
      }
    },
    is: function(other) {
      var good = false;
    
      if(other) {
        if(other instanceof $.fn) {
          good = ($.equal(other.get(), this.get()));
        }
      }
      
      return true;
    }
  });
  $.extend($.attrFn, {
    fire: true,
    bind: true,
    toString: true,
    toArray: true,
    val: true,
    removeData: true,
    data: true,
    attr: true,
    each: true,
    append: true,
    get: true,
    hasClass: true,
    removeClass: true,
    addClass: true,
    css: true
  });
  $.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
    "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    "change select submit keydown keypress keyup error").split(" "), function( name ) {

    // Handle event binding
    $.fn.define(name, function(fn) {

      return arguments.length > 0 ?
      this.bind( name, fn ) :
      this.fire( name );
    });

    if ( $.attrFn ) {
      $.attrFn[ name ] = true;
    }
  });
  
  var runtil = /Until$/,
  rparentsprev = /^(?:parents|prevUntil|prevAll)/,
  // Note: This RegExp should be improved, or likely pulled from Sizzle
  rmultiselector = /,/,
  slice = Array.prototype.slice,
  // methods guaranteed to produce a unique set when starting from a unique set
  guaranteedUnique = {
    children: true,
    contents: true,
    next: true,
    prev: true
  };
  $.each({
    parent: function( elem ) {
      var parent = elem.parentNode;
      return parent && parent.nodeType !== 11 ? parent : null;
    },
    parents: function( elem ) {
      return $.dir( elem, "parentNode" );
    },
    next: function( elem ) {
      return jQuery.nth( elem, 2, "nextSibling" );
    },
    prev: function( elem ) {
      return jQuery.nth( elem, 2, "previousSibling" );
    },
    nextAll: function( elem ) {
      return jQuery.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
      return jQuery.dir( elem, "previousSibling" );
    },
    siblings: function( elem ) {
      return jQuery.sibling( elem.parentNode.firstChild, elem );
    },
    children: function( elem ) {
      return jQuery.sibling( elem.firstChild );
    },
    contents: function( elem ) {
      return jQuery.nodeName( elem, "iframe" ) ?
      elem.contentDocument || elem.contentWindow.document :
      $( elem.childNodes );
    }
  }, function( fn, name ) {
    $.fn.define(name, function( until, selector ) {
      var ret = $.map( this, fn, until ),
      // The variable 'args' was introduced in
      // https://github.com/jquery/jquery/commit/52a0238
      // to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
      // http://code.google.com/p/v8/issues/detail?id=1050
      args = slice.call(arguments);

      if ( !runtil.test( name ) ) {
        selector = until;
      }

      if ( selector && typeof selector === "string" ) {
        ret = $.filter( 'css', selector, ret );
      }
        
      ret = this.length > 1 && !guaranteedUnique[ name ] ? $.unique( ret ) : ret;

      if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
        ret = ret.reverse();
      }

      return $(ret);
    });
  });
  $.each({
    id: {
      prop: 'id'
    },
    classes: {
      prop: 'class'
    }
  }, function(options, name) {
    options = $.extend($.copy(defaultOptions.props), options);
    if(!(options && $.isDefined(options.getter) && $.isFunction(options.getParams))) return;
    if(($.equal(options.getParams, defaultOptions.props.getParams)) && !(options.prop && $.isString(options.prop))) return;
    $.fn.define(name, function(val) {
      return $.getProp(this, options.getter, options.getParams(options.prop, val));
    });
  });
  window.$ = $;

(function(snack, $, document) {
  $.setEngine({
    query: function(selector, context) {
      if($.isUndefined(context)) context = document;
      if($.isString(context)) context = Slick.search(document, context);
      return Slick.search(context, selector);
    },
    filter: function(selector, elems, not) {
      return $.filter('array', function(o) {
        return Slick.match(o, not ? ":not(" + selector + ")" : selector);
      }, elems, false, false);
    },
    addPseudo: function(name, fn) {
      Slick.definePseudo(name, fn);
    }
  });
  function createElemFromSelector(expr) {
    var i = 0, elem, name, val;
    if(expr.tag == "*") expr.tag = 'div';
    elem = document.createElement(expr.tag);
    if($.isDefined(expr.attributes)) for(; i < expr.attributes.length; i++) {
      name = expr.attributes[i].key;
      val = expr.attributes[i].value;
      if(name == "text") $(elem).text(val)
      else if(name == "html") elem.innerHTML = val;
      else elem.setAttribute(expr.attributes[i].key, expr.attributes[i].value);
    }
    if(expr.classes) elem.className = expr.classes.join(' ');
    if(expr.id) elem.id = expr.id;

    return elem;
  }
  function makeElemFromCss(elExpr) {
    var elem, levelEl, i = 0, nextAdd, expr, els = new Array(), rtnEls = new Array(), addEls = new Array(), nextPre, preEls = new Array(), j;
    for(; i < elExpr.length; i++) {
      expr = elExpr[i];

      elem = createElemFromSelector(expr);

      els.push(elem);

      function ProcessPre() {
        if(levelEl) {
          for(j = 0; j < preEls.length; j++) {
            if($.isElement(levelEl.firstChild)) levelEl.insertBefore(preEls[j], levelEl.firstChild);
            else levelEl.appendChild(preEls[j]);
          }
        } else {
          rtnEls = preEls;
          levelEl = preEls[0];
        }
        preEls = new Array();
        nextPre = false;
      }

      function ProcessAdd() {
        if(levelEl) {
          for(j = 0; j < addEls.length; j++) {
            levelEl.appendChild(addEls[j]);
          }
        } else {
          rtnEls = addEls;
          levelEl = addEls[0];
        }
        addEls = new Array();
        nextAdd = false;
      }

      switch(expr.combinator) {
        case "~":
        case "+":
          if(nextPre) ProcessPre();
          addEls.push(elem);
          nextAdd = true;
          if(elExpr.length == i + 1) ProcessAdd();
          break;
        case "!~":
        case "!+":
          if(nextAdd) ProcessAdd();
          preEls.push(elem);
          nextPre = true;
          if(elExpr.length == i + 1) ProcessPre();
          break;
        case ">":
        case " ":
        default:
          if(elExpr[i+1] && (elExpr[i+1].combinator == "+" || elExpr[i+1].combinator == "~")) {
            addEls.push(elem);
          } else if(elExpr[i+1] && (elExpr[i+1].combinator == "!+" || elExpr[i+1].combinator == "!~")) {
            preEls.push(elem);
          } else {
            if(nextAdd) ProcessAdd();
            else if(nextPre) ProcessPre();

            if(levelEl) {
              levelEl.appendChild(elem);
              levelEl = elem;
            } else {
              rtnEls = [elem];
            }
          }
          break;
      }
    }

    return rtnEls;
  }
  $.extend({
    createFromCss: function(selector) {
      var elems = new Array(), parsed = Slick.parse(selector), i = 0, j = 0, elemExpr;
      for(; i < parsed.expressions.length; i++) { // loop through all the expressions
        elemExpr = parsed.expressions[i];

        elems = elems.concat(makeElemFromCss(elemExpr));
      }
      return $(elems);
    }
  });
})(window.snack, window.$, document);

  snack.extend($, {
    support: (function() {

      var div = document.createElement( "div" ),
      all,
      a,
      select,
      opt,
      input,
      marginDiv,
      support,
      fragment,
      body,
      bodyStyle,
      tds,
      events,
      eventName,
      i,
      isSupported;

      // Preliminary tests
      div.setAttribute("className", "t");
      div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

      all = div.getElementsByTagName( "*" );
      a = div.getElementsByTagName( "a" )[ 0 ];

      // Can't get basic test support
      if ( !all || !all.length || !a ) {
        return {};
      }

      // First batch of supports tests
      select = document.createElement( "select" );
      opt = select.appendChild( document.createElement("option") );
      input = div.getElementsByTagName( "input" )[ 0 ];

      support = {
        // IE strips leading whitespace when .innerHTML is used
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        // Make sure that tbody elements aren't automatically inserted
        // IE will insert them into empty tables
        tbody: !div.getElementsByTagName( "tbody" ).length,

        // Make sure that link elements get serialized correctly by innerHTML
        // This requires a wrapper element in IE
        htmlSerialize: !!div.getElementsByTagName( "link" ).length,

        // Get the style information from getAttribute
        // (IE uses .cssText instead)
        style: /top/.test( a.getAttribute("style") ),

        // Make sure that URLs aren't manipulated
        // (IE normalizes it by default)
        hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

        // Make sure that element opacity exists
        // (IE uses filter instead)
        // Use a regex to work around a WebKit issue. See #5145
        opacity: /^0.55$/.test( a.style.opacity ),

        // Verify style float existence
        // (IE uses styleFloat instead of cssFloat)
        cssFloat: !!a.style.cssFloat,

        // Make sure that if no value is specified for a checkbox
        // that it defaults to "on".
        // (WebKit defaults to "" instead)
        checkOn: ( input.value === "on" ),

        // Make sure that a selected-by-default option has a working selected property.
        // (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
        optSelected: opt.selected,

        // Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
        getSetAttribute: div.className !== "t",

        // Will be defined later
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true
      };

      // Make sure checked status is properly cloned
      input.checked = true;
      support.noCloneChecked = input.cloneNode( true ).checked;

      // Make sure that the options inside disabled selects aren't marked as disabled
      // (WebKit marks them as disabled)
      select.disabled = true;
      support.optDisabled = !opt.disabled;

      // Test to see if it's possible to delete an expando from an element
      // Fails in Internet Explorer
      try {
        delete div.test;
      } catch( e ) {
        support.deleteExpando = false;
      }

      if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", function click() {
          // Cloning a node shouldn't copy over any
          // bound event handlers (IE does this)
          support.noCloneEvent = false;
          div.detachEvent( "onclick", click );
        });
        div.cloneNode( true ).fireEvent( "onclick" );
      }

      // Check if a radio maintains it's value
      // after being appended to the DOM
      input = document.createElement("input");
      input.value = "t";
      input.setAttribute("type", "radio");
      support.radioValue = input.value === "t";

      input.setAttribute("checked", "checked");
      div.appendChild( input );
      fragment = document.createDocumentFragment();
      fragment.appendChild( div.firstChild );

      // WebKit doesn't clone checked state correctly in fragments
      support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

      div.innerHTML = "";

      // Figure out if the W3C box model works as expected
      div.style.width = div.style.paddingLeft = "1px";

      // We use our own, invisible, body
      body = document.createElement( "body" );
      bodyStyle = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        // Set background to avoid IE crashes when removing (#9028)
        background: "none"
      };
      for ( i in bodyStyle ) {
        body.style[ i ] = bodyStyle[ i ];
      }
      body.appendChild( div );
      document.documentElement.appendChild( body );

      // Check if a disconnected checkbox will retain its checked
      // value of true after appended to the DOM (IE6/7)
      support.appendChecked = input.checked;

      support.boxModel = div.offsetWidth === 2;

      if ( "zoom" in div.style ) {
        // Check if natively block-level elements act like inline-block
        // elements when setting their display to 'inline' and giving
        // them layout
        // (IE < 8 does this)
        div.style.display = "inline";
        div.style.zoom = 1;
        support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

        // Check if elements with layout shrink-wrap their children
        // (IE 6 does this)
        div.style.display = "";
        div.innerHTML = "<div style='width:4px;'></div>";
        support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
      }

      div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName( "td" );

      // Check if table cells still have offsetWidth/Height when they are set
      // to display:none and there are still other visible table cells in a
      // table row; if so, offsetWidth/Height are not reliable for use when
      // determining if an element has been hidden directly using
      // display:none (it is still safe to use offsets if a parent element is
      // hidden; don safety goggles and see bug #4512 for more information).
      // (only IE 8 fails this test)
      isSupported = ( tds[ 0 ].offsetHeight === 0 );

      tds[ 0 ].style.display = "";
      tds[ 1 ].style.display = "none";

      // Check if empty table cells still have offsetWidth/Height
      // (IE < 8 fail this test)
      support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
      div.innerHTML = "";

      // Check if div with explicit width and no margin-right incorrectly
      // gets computed margin-right based on width of container. For more
      // info see bug #3333
      // Fails in WebKit before Feb 2011 nightlies
      // WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
      if ( document.defaultView && document.defaultView.getComputedStyle ) {
        marginDiv = document.createElement( "div" );
        marginDiv.style.width = "0";
        marginDiv.style.marginRight = "0";
        div.appendChild( marginDiv );
        support.reliableMarginRight =
        ( parseInt( document.defaultView.getComputedStyle( marginDiv, null ).marginRight, 10 ) || 0 ) === 0;
      }

      // Remove the body element we added
      body.innerHTML = "";
      document.documentElement.removeChild( body );

      // Technique from Juriy Zaytsev
      // http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
      // We only care about the case where non-standard event systems
      // are used, namely in IE. Short-circuiting here helps us to
      // avoid an eval call (in setAttribute) which can cause CSP
      // to go haywire. See: https://developer.mozilla.org/en/Security/CSP
      if ( div.attachEvent ) {
        for( i in {
          submit: 1,
          change: 1,
          focusin: 1
        } ) {
          eventName = "on" + i;
          isSupported = ( eventName in div );
          if ( !isSupported ) {
            div.setAttribute( eventName, "return;" );
            isSupported = ( typeof div[ eventName ] === "function" );
          }
          support[ i + "Bubbles" ] = isSupported;
        }
      }

      return support;
    })()
  });


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

})(window.snack);
(function() {
  var pseudos = {
    enabled: function( elem ) {
      return elem.disabled === false && elem.type !== "hidden";
    },

    disabled: function( elem ) {
      return elem.disabled === true;
    },

    checked: function( elem ) {
      return elem.checked === true;
    },
		
    selected: function( elem ) {
      // Accessing this property makes selected-by-default
      // options in Safari work properly
      if ( elem.parentNode ) {
        elem.parentNode.selectedIndex;
      }
			
      return elem.selected === true;
    },

    parent: function( elem ) {
      return !!elem.firstChild;
    },

    empty: function( elem ) {
      return !elem.firstChild;
    },

    has: function( elem, i, match ) {
      return !!Sizzle( match[3], elem ).length;
    },

    header: function( elem ) {
      return (/h\d/i).test( elem.nodeName );
    },

    text: function( elem ) {
      var attr = elem.getAttribute( "type" ), type = elem.type;
      // IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
      // use getAttribute instead to test this case
      return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
    },

    radio: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
    },

    checkbox: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
    },

    file: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
    },

    password: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
    },

    submit: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return (name === "input" || name === "button") && "submit" === elem.type;
    },

    image: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
    },

    reset: function( elem ) {
      return elem.nodeName.toLowerCase() === "input" && "reset" === elem.type;
    },

    button: function( elem ) {
      var name = elem.nodeName.toLowerCase();
      return name === "input" && "button" === elem.type || name === "button";
    },

    input: function( elem ) {
      return (/input|select|textarea|button/i).test( elem.nodeName );
    },

    focus: function( elem ) {
      return elem === elem.ownerDocument.activeElement;
    }
  };

  $.each(pseudos, function(pseudo, name) {
    $._internal.selector.addPseudo(name, pseudo)
  });
})();
/*
---
name: Slick.Parser
description: Standalone CSS3 Selector parser
provides: Slick.Parser
...
*/

(function(){
	
var exports = this;
	
var parsed,
	separatorIndex,
	combinatorIndex,
	partIndex,
	reversed,
	cache = {},
	reverseCache = {};

var parse = function(expression, isReversed){
	expression = ('' + expression).replace(/^\s+|\s+$/g, '');
	reversed = !!isReversed;
	var currentCache = (reversed) ? reverseCache : cache;
	if (currentCache[expression]) return currentCache[expression];
	parsed = {Slick: true, expressions: [], raw: expression, reverse: function(){
		return parse(this.raw, true);
	}};
	separatorIndex = -1;
	while (expression != (expression = expression.replace(regexp, parser)));
	parsed.length = parsed.expressions.length;
	return currentCache[expression] = (reversed) ? reverse(parsed) : parsed;
};

var reverseCombinator = function(combinator){
	if (combinator === '!') return ' ';
	else if (combinator === ' ') return '!';
	else if ((/^!/).test(combinator)) return combinator.replace(/^(!)/, '');
	else return '!' + combinator;
};

var reverse = function(expression){
	var expressions = expression.expressions;
	for (var i = 0; i < expressions.length; i++){
		var exp = expressions[i];
		var last = {parts: [], tag: '*', combinator: reverseCombinator(exp[0].combinator)};
		
		for (var j = 0; j < exp.length; j++){
			var cexp = exp[j];
			if (!cexp.reverseCombinator) cexp.reverseCombinator = ' ';
			cexp.combinator = cexp.reverseCombinator;
			delete cexp.reverseCombinator;
		}
		
		exp.reverse().push(last);
	}
	return expression;
};

var escapeRegExp = function(string){// Credit: XRegExp 0.6.1 (c) 2007-2008 Steven Levithan <http://stevenlevithan.com/regex/xregexp/> MIT License
	return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
};

var regexp = new RegExp(
/*
#!/usr/bin/env ruby
puts "\t\t" + DATA.read.gsub(/\(\?x\)|\s+#.*$|\s+|\\$|\\n/,'')
__END__
	"(?x)^(?:\
	  \\s* ( , ) \\s*               # Separator          \n\
	| \\s* ( <combinator>+ ) \\s*   # Combinator         \n\
	|      ( \\s+ )                 # CombinatorChildren \n\
	|      ( <unicode>+ | \\* )     # Tag                \n\
	| \\#  ( <unicode>+       )     # ID                 \n\
	| \\.  ( <unicode>+       )     # ClassName          \n\
	|                               # Attribute          \n\
	\\[  \
		\\s* (<unicode1>+)  (?:  \
			\\s* ([*^$!~|]?=)  (?:  \
				\\s* (?:\
					([\"']?)(.*?)\\9 \
				)\
			)  \
		)?  \\s*  \
	\\](?!\\]) \n\
	|   :+ ( <unicode>+ )(?:\
	\\( (?:\
		 ([\"']?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\12\
	) \\)\
	)?\
	)"
*/
	"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|:+(<unicode>+)(?:\\((?:([\"']?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\12)\\))?)"
	//"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:\"((?:[^\"]|\\\\\")*)\"|'((?:[^']|\\\\')*)'|([^\\]]*?))))?\\s*\\](?!\\])|:+(<unicode>+)(?:\\((?:\"((?:[^\"]|\\\")*)\"|'((?:[^']|\\')*)'|([^\\)]*))\\))?)"//*/
	.replace(/<combinator>/, '[' + escapeRegExp(">+~`!@$%^&={}\\;</") + ']')
	.replace(/<unicode>/g, '(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
	.replace(/<unicode1>/g, '(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])')
);

function parser(
	rawMatch,
	
	separator,
	combinator,
	combinatorChildren,
	
	tagName,
	id,
	className,
	
	attributeKey,
	attributeOperator,
	attributeQuote,
	attributeValue,
	
	pseudoClass,
	pseudoQuote,
	pseudoClassValue
){
	if (separator || separatorIndex === -1){
		parsed.expressions[++separatorIndex] = [];
		combinatorIndex = -1;
		if (separator) return '';
	}
	
	if (combinator || combinatorChildren || combinatorIndex === -1){
		combinator = combinator || ' ';
		var currentSeparator = parsed.expressions[separatorIndex];
		if (reversed && currentSeparator[combinatorIndex])
			currentSeparator[combinatorIndex].reverseCombinator = reverseCombinator(combinator);
		currentSeparator[++combinatorIndex] = {combinator: combinator, tag: '*', parts: []};
		partIndex = 0;
	}
	
	var currentParsed = parsed.expressions[separatorIndex][combinatorIndex];

	if (tagName){
		currentParsed.tag = tagName.replace(/\\/g,'');
		return '';
	} else if (id){
		currentParsed.id = id.replace(/\\/g,'');
		return '';
	} else if (className){
		className = className.replace(/\\/g,'');
	
		if (!currentParsed.classes) currentParsed.classes = [className];
		else currentParsed.classes.push(className);
	
		currentParsed.parts[partIndex] = {
			type: 'class',
			value: className,
			regexp: new RegExp('(^|\\s)' + escapeRegExp(className) + '(\\s|$)')
		};
		partIndex++;
		
	} else if (pseudoClass){
		if (!currentParsed.pseudos) currentParsed.pseudos = [];
		
		var value = pseudoClassValue || null;
		if (value) value = value.replace(/\\/g,'');
		
		currentParsed.pseudos.push(currentParsed.parts[partIndex] = {
			type: 'pseudo',
			key: pseudoClass.replace(/\\/g,''),
			value: value
		});
		partIndex++;
		
	} else if (attributeKey){
		if (!currentParsed.attributes) currentParsed.attributes = [];
		
		var key = attributeKey.replace(/\\/g,'');
		var operator = attributeOperator;
		var attribute = (attributeValue || '').replace(/\\/g,'');
		
		var test, regexp;
		
		switch (operator){
			case '^=' : regexp = new RegExp(       '^'+ escapeRegExp(attribute)            ); break;
			case '$=' : regexp = new RegExp(            escapeRegExp(attribute) +'$'       ); break;
			case '~=' : regexp = new RegExp( '(^|\\s)'+ escapeRegExp(attribute) +'(\\s|$)' ); break;
			case '|=' : regexp = new RegExp(       '^'+ escapeRegExp(attribute) +'(-|$)'   ); break;
			case  '=' : test = function(value){
				return attribute == value;
			}; break;
			case '*=' : test = function(value){
				return value && value.indexOf(attribute) > -1;
			}; break;
			case '!=' : test = function(value){
				return attribute != value;
			}; break;
			default   : test = function(value){
				return !!value;
			};
		}
		
		if (!test) test = function(value){
			return value && regexp.test(value);
		};
		
		currentParsed.attributes.push(currentParsed.parts[partIndex] = {
			type: 'attribute',
			key: key,
			operator: operator,
			value: attribute,
			test: test
		});
		partIndex++;
		
	}
	
	return '';
};

// Slick NS

var Slick = exports.Slick || {};

Slick.parse = function(expression){
	return parse(expression);
};

Slick.escapeRegExp = escapeRegExp;

if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);
/*
---
name: Slick.Finder
description: The new, superfast css selector engine.
provides: Slick.Finder
requires: Slick.Parser
...
*/

(function(){
	
var exports = this;

var local = {};

var timeStamp = +new Date();

// Feature / Bug detection

local.isNativeCode = function(fn){
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

local.isXML = function(document){
	return (!!document.xmlVersion) || (!!document.xml) || (Object.prototype.toString.call(document) === '[object XMLDocument]') ||
	(document.nodeType === 9 && document.documentElement.nodeName !== 'HTML');
};

local.setDocument = function(document){
	
	// convert elements / window arguments to document. if document cannot be extrapolated, the function returns.
	
	if (document.nodeType === 9); // document
	else if (document.ownerDocument) document = document.ownerDocument; // node
	else if (document.navigator) document = document.document; // window
	else return;
	
	// check if it's the old document
	
	if (this.document === document) return;
	this.document = document;
	var root = this.root = document.documentElement;
	
	// document sort
	
	this.brokenStarGEBTN
	= this.starSelectsClosedQSA
	= this.idGetsName
	= this.brokenMixedCaseQSA
	= this.brokenGEBCN
	= false;
	
	var starSelectsClosed, starSelectsComments,
		brokenSecondClassNameGEBCN, cachedGetElementsByClassName;
	
	if (!(this.isXMLDocument = this.isXML(document))){
		
		var testNode = document.createElement('div');
		this.root.appendChild(testNode);
		var selected, id;
		
		// IE returns comment nodes for getElementsByTagName('*') for some documents
		testNode.appendChild(document.createComment(''));
		starSelectsComments = (testNode.getElementsByTagName('*').length > 0);
		
		// IE returns closed nodes (EG:"</foo>") for getElementsByTagName('*') for some documents
		try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.getElementsByTagName('*');
			starSelectsClosed = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		this.brokenStarGEBTN = starSelectsComments || starSelectsClosed;
		
		// IE 8 returns closed nodes (EG:"</foo>") for querySelectorAll('*') for some documents
		if (testNode.querySelectorAll) try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.querySelectorAll('*');
			this.starSelectsClosedQSA = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		// IE returns elements with the name instead of just id for getElementById for some documents
		try {
			id = 'idgetsname' + timeStamp;
			testNode.innerHTML = ('<a name='+id+'></a><b id='+id+'></b>');
			this.idGetsName = testNode.ownerDocument.getElementById(id) === testNode.firstChild;
		} catch(e){};
		
		// Safari 3.2 QSA doesnt work with mixedcase on quirksmode
		try {
			testNode.innerHTML = '<a class="MiXedCaSe"></a>';
			this.brokenMixedCaseQSA = !testNode.querySelectorAll('.MiXedCaSe').length;
		} catch(e){};

		try {
			testNode.innerHTML = '<a class="f"></a><a class="b"></a>';
			testNode.getElementsByClassName('b').length;
			testNode.firstChild.className = 'b';
			cachedGetElementsByClassName = (testNode.getElementsByClassName('b').length != 2);
		} catch(e){};
		
		// Opera 9.6 GEBCN doesnt detects the class if its not the first one
		try {
			testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
			brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
		} catch(e){};
		
		this.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
		
		this.root.removeChild(testNode);
		testNode = null;
		
	}
	
	// contains
	
	this.contains = (root && this.isNativeCode(root.contains)) ? function(context, node){ // FIXME: Add specs: local.contains should be different for xml and html documents?
		return context.contains(node);
	} : (root && root.compareDocumentPosition) ? function(context, node){
		return context === node || !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		if (node) do {
			if (node === context) return true;
		} while ((node = node.parentNode));
		return false;
	};
	
	// document order sorting
	// credits to Sizzle (http://sizzlejs.com/)
	
	this.documentSorter = (root.compareDocumentPosition) ? function(a, b){
		if (!a.compareDocumentPosition || !b.compareDocumentPosition) return 0;
		return a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
	} : ('sourceIndex' in root) ? function(a, b){
		if (!a.sourceIndex || !b.sourceIndex) return 0;
		return a.sourceIndex - b.sourceIndex;
	} : (document.createRange) ? function(a, b){
		if (!a.ownerDocument || !b.ownerDocument) return 0;
		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		return aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
	} : null ;
	
	this.getUID = (this.isXMLDocument) ? this.getUIDXML : this.getUIDHTML;
	
};
	
// Main Method

local.search = function(context, expression, append, first){
	
	var found = this.found = (first) ? null : (append || []);
	
	// context checks

	if (!context) return found; // No context
	if (context.navigator) context = context.document; // Convert the node from a window to a document
	else if (!context.nodeType) return found; // Reject misc junk input

	// setup
	
	var parsed, i, l;

	this.positions = {};
	var uniques = this.uniques = {};
	
	if (this.document !== (context.ownerDocument || context)) this.setDocument(context);

	// expression checks
	
	if (typeof expression == 'string'){ // expression is a string
		
		// Overrides

		for (i = this.overrides.length; i--;){
			var override = this.overrides[i];
			if (override.regexp.test(expression)){
				var result = override.method.call(context, expression, found, first);
				if (result === false) continue;
				if (result === true) return found;
				return result;
			}
		}
		
		parsed = this.Slick.parse(expression);
		if (!parsed.length) return found;
	} else if (expression == null){ // there is no expression
		return found;
	} else if (expression.Slick){ // expression is a parsed Slick object
		parsed = expression;
	} else if (this.contains(context.documentElement || context, expression)){ // expression is a node
		(found) ? found.push(expression) : found = expression;
		return found;
	} else { // other junk
		return found;
	}
		
	// should sort if there are nodes in append and if you pass multiple expressions.
	// should remove duplicates if append already has items
	var shouldUniques = !!(append && append.length);
	
	// if append is null and there is only a single selector with one expression use pushArray, else use pushUID
	this.push = this.pushUID;
	if (!shouldUniques && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) this.push = this.pushArray;
	
	if (found == null) found = [];
	
	// avoid duplicating items already in the append array
	if (shouldUniques) for (i = 0, l = found.length; i < l; i++) this.uniques[this.getUID(found[i])] = true;
	
	// default engine
	
	var currentExpression, currentBit;
	var j, m, n;
	var combinator, tag, id, parts, classes, attributes, pseudos;
	var currentItems;
	var expressions = parsed.expressions;
	var lastBit;
	
	search: for (i = 0; (currentExpression = expressions[i]); i++) for (j = 0; (currentBit = currentExpression[j]); j++){

		combinator = 'combinator:' + currentBit.combinator;
		if (!this[combinator]) continue search;
		
		tag        = (this.isXMLDocument) ? currentBit.tag : currentBit.tag.toUpperCase();
		id         = currentBit.id;
		parts      = currentBit.parts;
		classes    = currentBit.classes;
		attributes = currentBit.attributes;
		pseudos    = currentBit.pseudos;
		lastBit    = (j === (currentExpression.length - 1));
	
		this.bitUniques = {};
		
		if (lastBit){
			this.uniques = uniques;
			this.found = found;
		} else {
			this.uniques = {};
			this.found = [];
		}

		if (j === 0){
			this[combinator](context, tag, id, parts, classes, attributes, pseudos);
			if (first && lastBit && found.length) break search;
		} else {
			if (first && lastBit) for (m = 0, n = currentItems.length; m < n; m++){
				this[combinator](currentItems[m], tag, id, parts, classes, attributes, pseudos);
				if (found.length) break search;
			} else for (m = 0, n = currentItems.length; m < n; m++) this[combinator](currentItems[m], tag, id, parts, classes, attributes, pseudos);
		}
		
		currentItems = this.found;
	}
	
	if (shouldUniques || (parsed.expressions.length > 1)) this.sort(found);
	
	return (first) ? (found[0] || null) : found;
};

// Utils

local.uidx = 1;
local.uidk = 'slick:uniqueid';

local.getUIDXML = function(node){
	var uid = node.getAttribute(this.uidk);
	if (!uid){
		uid = this.uidx++;
		node.setAttribute(this.uidk, uid);
	}
	return uid;
};

local.getUIDHTML = function(node){
	return node.uniqueNumber || (node.uniqueNumber = this.uidx++);
};

// sort based on the setDocument documentSorter method.

local.sort = function(results){
	if (!this.documentSorter) return results;
	results.sort(this.documentSorter);
	return results;
};

local.cacheNTH = {};

local.matchNTH = /^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;

local.parseNTHArgument = function(argument){
	var parsed = argument.match(this.matchNTH);
	if (!parsed) return false;
	var special = parsed[2] || false;
	var a = parsed[1] || 1;
	if (a == '-') a = -1;
	var b = parseInt(parsed[3], 10) || 0;
	switch (special){
		case 'n':    parsed = {a: a, b: b}; break;
		case 'odd':  parsed = {a: 2, b: 1}; break;
		case 'even': parsed = {a: 2, b: 0}; break;
		default:     parsed = {a: 0, b: a};
	}
	return (this.cacheNTH[argument] = parsed);
};

local.pushArray = function(node, tag, id, selector, classes, attributes, pseudos){
	if (this.matchSelector(node, tag, id, selector, classes, attributes, pseudos)) this.found.push(node);
};

local.pushUID = function(node, tag, id, selector, classes, attributes, pseudos){
	var uid = this.getUID(node);
	if (!this.uniques[uid] && this.matchSelector(node, tag, id, selector, classes, attributes, pseudos)){
		this.uniques[uid] = true;
		this.found.push(node);
	}
};

local.matchNode = function(node, selector){
	var parsed = ((selector.Slick) ? selector : this.Slick.parse(selector));
	if (!parsed) return true;
	
	// simple (single) selectors
	if(parsed.length == 1 && parsed.expressions[0].length == 1){
		var exp = parsed.expressions[0][0];
		return this.matchSelector(node, (this.isXMLDocument) ? exp.tag : exp.tag.toUpperCase(), exp.id, exp.parts);
	}

	var nodes = this.search(this.document, parsed);
	for (var i=0, item; item = nodes[i++];){
		if (item === node) return true;
	}
	return false;
};

local.matchPseudo = function(node, name, argument){
	var pseudoName = 'pseudo:' + name;
	if (this[pseudoName]) return this[pseudoName](node, argument);
	var attribute = this.getAttribute(node, name);
	return (argument) ? argument == attribute : !!attribute;
};

local.matchSelector = function(node, tag, id, parts, classes, attributes, pseudos){
	if (tag && tag == '*' && (node.nodeType != 1 || node.nodeName.charCodeAt(0) == 47)) return false; // Fix for comment nodes and closed nodes
	if (tag && tag != '*' && (!node.nodeName || node.nodeName != tag)) return false;
	if (id && node.getAttribute('id') != id) return false;
	if (parts) for (var i = 0, l = parts.length, part, cls; i < l; i++){
		part = parts[i];
		if (!part) continue;
		if (part.type == 'class' && classes !== false){
			cls = ('className' in node) ? node.className : node.getAttribute('class');	
			if (!(cls && part.regexp.test(cls))) return false;
		}
		if (part.type == 'pseudo' && pseudos !== false && (!this.matchPseudo(node, part.key, part.value))) return false;
		if (part.type == 'attribute' && attributes !== false && (!part.test(this.getAttribute(node, part.key)))) return false;
	}
	return true;
};

var combinators = {

	' ': function(node, tag, id, parts, classes, attributes, pseudos){ // all child nodes, any level
		
		var i, l, item, children;

		if (!this.isXMLDocument){
			getById: if (id){
				item = this.document.getElementById(id);
				if ((!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
					// all[id] returns all the elements with that name or id inside node
					// if theres just one it will return the element, else it will be a collection
					children = node.all[id];
					if (!children) return;
					if (!children[0]) children = [children];
					for (i = 0; item = children[i++];) if (item.getAttributeNode('id').nodeValue == id){
						this.push(item, tag, null, parts);
						break;
					} 
					return;
				}
				if (!item){
					// if the context is in the dom we return, else we will try GEBTN, breaking the getById label
					if (this.contains(this.document.documentElement, node)) return;
					else break getById;
				} else if (this.document !== node && !this.contains(node, item)) return;
				this.push(item, tag, null, parts);
				return;
			}
			getByClass: if (node.getElementsByClassName && classes && !this.brokenGEBCN){
				children = node.getElementsByClassName(classes.join(' '));
				if (!(children && children.length)) break getByClass;
				for (i = 0, l = children.length; i < l; i++) this.push(children[i], tag, id, parts, false);
				return;
			}
		}
		getByTag: {
			children = node.getElementsByTagName(tag);
			if (!(children && children.length)) break getByTag;
			if (!this.brokenStarGEBTN) tag = null;
			var child;
			for (i = 0; child = children[i++];) this.push(child, tag, id, parts);
		}
	},
	
	'!': function(node, tag, id, parts){  // all parent nodes up to document
		while ((node = node.parentNode)) if (node !== document) this.push(node, tag, id, parts);
	},

	'>': function(node, tag, id, parts){ // direct children
		if ((node = node.firstChild)) do {
			if (node.nodeType === 1) this.push(node, tag, id, parts);
		} while ((node = node.nextSibling));
	},
	
	'!>': function(node, tag, id, parts){ // direct parent (one level)
		node = node.parentNode;
		if (node !== document) this.push(node, tag, id, parts);
	},

	'+': function(node, tag, id, parts){ // next sibling
		while ((node = node.nextSibling)) if (node.nodeType === 1){
			this.push(node, tag, id, parts);
			break;
		}
	},

	'!+': function(node, tag, id, parts){ // previous sibling
		while ((node = node.previousSibling)) if (node.nodeType === 1){
			this.push(node, tag, id, parts);
			break;
		}
	},

	'^': function(node, tag, id, parts){ // first child
		node = node.firstChild;
		if (node){
			if (node.nodeType === 1) this.push(node, tag, id, parts);
			else this['combinator:+'](node, tag, id, parts);
		}
	},

	'!^': function(node, tag, id, parts){ // last child
		node = node.lastChild;
		if (node){
			if (node.nodeType === 1) this.push(node, tag, id, parts);
			else this['combinator:!+'](node, tag, id, parts);
		}
	},

	'~': function(node, tag, id, parts){ // next siblings
		while ((node = node.nextSibling)){
			if (node.nodeType !== 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, parts);
		}
	},

	'!~': function(node, tag, id, parts){ // previous siblings
		while ((node = node.previousSibling)){
			if (node.nodeType !== 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, parts);
		}
	},
	
	'++': function(node, tag, id, parts){ // next sibling and previous sibling
		this['combinator:+'](node, tag, id, parts);
		this['combinator:!+'](node, tag, id, parts);
	},

	'~~': function(node, tag, id, parts){ // next siblings and previous siblings
		this['combinator:~'](node, tag, id, parts);
		this['combinator:!~'](node, tag, id, parts);
	}

};

for (var c in combinators) local['combinator:' + c] = combinators[c];

var pseudos = {

	'empty': function(node){
		return !node.firstChild && !(node.innerText || node.textContent || '').length;
	},

	'not': function(node, expression){
		return !this.matchNode(node, expression);
	},

	'contains': function(node, text){
		var inner = node.innerText || node.textContent || '';
		return (inner) ? inner.indexOf(text) > -1 : false;
	},

	'first-child': function(node){
		return this['pseudo:nth-child'](node, '1');
	},

	'last-child': function(node){
		while ((node = node.nextSibling)) if (node.nodeType === 1) return false;
		return true;
	},

	'only-child': function(node){
		var prev = node;
		while ((prev = prev.previousSibling)) if (prev.nodeType === 1) return false;
		var next = node;
		while ((next = next.nextSibling)) if (next.nodeType === 1) return false;
		return true;
	},

	'nth-child': function(node, argument){
		argument = (!argument) ? 'n' : argument;
		var parsed = this.cacheNTH[argument] || this.parseNTHArgument(argument);
		var uid = this.getUID(node);
		if (!this.positions[uid]){
			var count = 1;
			while ((node = node.previousSibling)){
				if (node.nodeType !== 1) continue;
				var puid = this.getUID(node);
				var position = this.positions[puid];
				if (position != null){
					count = position + count;
					break;
				}
				count++;
			}
			this.positions[uid] = count;
		}
		var a = parsed.a, b = parsed.b, pos = this.positions[uid];
		if (a == 0) return b == pos;
		if (a > 0){
			if (pos < b) return false;
		} else {
			if (b < pos) return false;
		}
		return ((pos - b) % a) == 0;
	},

	// custom pseudos

	'index': function(node, index){
		return this['pseudo:nth-child'](node, '' + index + 1);
	},

	'even': function(node, argument){
		return this['pseudo:nth-child'](node, '2n');
	},

	'odd': function(node, argument){
		return this['pseudo:nth-child'](node, '2n+1');
	},

	'enabled': function(node){
		return (node.disabled === false);
	},
	
	'disabled': function(node){
		return (node.disabled === true);
	},

	'checked': function(node){
		return node.checked;
	},

	'selected': function(node){
		return node.selected;
	}
};

for (var p in pseudos) local['pseudo:' + p] = pseudos[p];

// attributes methods

local.attributeGetters = {

	'class': function(){
		return ('className' in this) ? this.className : this.getAttribute('class');
	},
	
	'for': function(){
		return ('htmlFor' in this) ? this.htmlFor : this.getAttribute('for');
	},
	
	'href': function(){
		return ('href' in this) ? this.getAttribute('href', 2) : this.getAttribute('href');
	},
	
	'style': function(){
		return (this.style) ? this.style.cssText : this.getAttribute('style');
	}

};

local.getAttribute = function(node, name){
	// FIXME: check if getAttribute() will get input elements on a form on this browser
	// getAttribute is faster than getAttributeNode().nodeValue
	var method = this.attributeGetters[name];
	if (method) return method.call(node);
	var attributeNode = node.getAttributeNode(name);
	return attributeNode ? attributeNode.nodeValue : null;
};

// overrides

local.overrides = [];

local.override = function(regexp, method){
	this.overrides.push({regexp: regexp, method: method});
};

local.override(/./, function(expression, found, first){ //querySelectorAll override

	if (!this.querySelectorAll || this.nodeType != 9 || local.isXMLDocument || local.brokenMixedCaseQSA || Slick.disableQSA) return false;
	
	var nodes, node;
	try {
		if (first) return this.querySelector(expression) || null;
		else nodes = this.querySelectorAll(expression);
	} catch(error){
		return false;
	}

	var i, hasOthers = !!(found.length);

	if (local.starSelectsClosedQSA) for (i = 0; node = nodes[i++];){
		if (node.nodeName.charCodeAt(0) != 47 && (!hasOthers || !local.uniques[local.getUIDHTML(node)])) found.push(node);
	} else for (i = 0; node = nodes[i++];){
		if (!hasOthers || !local.uniques[local.getUIDHTML(node)]) found.push(node);
	}

	if (hasOthers) local.sort(found);

	return true;

});

local.override(/^[\w-]+$|^\*$/, function(expression, found, first){ // tag override
	var tag = expression;
	if (tag == '*' && local.brokenStarGEBTN) return false;
	
	var nodes = this.getElementsByTagName(tag);
	
	if (first) return nodes[0] || null;
	var i, node, hasOthers = !!(found.length);
	
	for (i = 0; node = nodes[i++];){
		if (!hasOthers || !local.uniques[local.getUID(node)]) found.push(node);
	}
	
	if (hasOthers) local.sort(found);

	return true;
});

local.override(/^\.[\w-]+$/, function(expression, found, first){ // class override
	if (local.isXMLDocument) return false;
	
	var nodes, node, i, hasOthers = !!(found && found.length), className = expression.substring(1);
	if (this.getElementsByClassName && !local.brokenGEBCN){
		nodes = this.getElementsByClassName(className);
		if (first) return nodes[0] || null;
		for (i = 0; node = nodes[i++];){
			if (!hasOthers || !local.uniques[local.getUIDHTML(node)]) found.push(node);
		}
	} else {
		var matchClass = new RegExp('(^|\\s)'+ Slick.escapeRegExp(className) +'(\\s|$)');
		nodes = this.getElementsByTagName('*');
		for (i = 0; node = nodes[i++];){
			if (!node.className || !matchClass.test(node.className)) continue;
			if (first) return node;
			if (!hasOthers || !local.uniques[local.getUIDHTML(node)]) found.push(node);
		}
	}
	if (hasOthers) local.sort(found);
	return (first) ? null : true;
});

local.override(/^#[\w-]+$/, function(expression, found, first){ // ID override
	if (local.isXMLDocument || this.nodeType != 9) return false;
	
	var id = expression.substring(1), el = this.getElementById(id);
	if (!el) return found;
	if (local.idGetsName && el.getAttributeNode('id').nodeValue != id) return false;
	if (first) return el || null;
	var hasOthers = !!(found.length) ;
	if (!hasOthers || !local.uniques[local.getUIDHTML(el)]) found.push(el);
	if (hasOthers) local.sort(found);
	return true;
});

if (typeof document != 'undefined') local.setDocument(document);

// Slick

var Slick = local.Slick = exports.Slick || {};

Slick.version = '0.9dev';

// Slick finder

Slick.search = function(context, expression, append){
	return local.search(context, expression, append);
};

Slick.find = function(context, expression){
	return local.search(context, expression, null, true);
};

// Slick containment checker

Slick.contains = function(container, node){
	local.setDocument(container);
	return local.contains(container, node);
};

// Slick attribute getter

Slick.getAttribute = function(node, name){
	return local.getAttribute(node, name);
};

// Slick matcher

Slick.match = function(node, selector){
	if (!(node && selector)) return false;
	if (!selector || selector === node) return true;
	if (typeof selector != 'string') return false;
	local.setDocument(node);
	return local.matchNode(node, selector);
};

// Slick attribute accessor

Slick.defineAttributeGetter = function(name, fn){
	local.attributeGetters[name] = fn;
	return this;
};

Slick.lookupAttributeGetter = function(name){
	return local.attributeGetters[name];
};

// Slick pseudo accessor

Slick.definePseudo = function(name, fn){
	local['pseudo:' + name] = function(node, argument){
		return fn.call(node, argument);
	};
	return this;
};

Slick.lookupPseudo = function(name){
	var pseudo = local['pseudo:' + name];
	if (pseudo) return function(argument){
		return pseudo.call(this, argument);
	};
	return null;
};

// Slick overrides accessor

Slick.override = function(regexp, fn){
	local.override(regexp, fn);
	return this;
};

// De-duplication of an array of HTML elements.

Slick.uniques = function(nodes, append){
	var uniques = {}, i, node, uid;
	if (!append) append = [];
	for (i = 0; node = append[i++];) uniques[local.getUIDHTML(node)] = true;
	
	for (i = 0; node = nodes[i++];){
		uid = local.getUIDHTML(node);
		if (!uniques[uid]){
			uniques[uid] = true;
			append.push(node);
		}
	}
	return append;
};

Slick.isXML = local.isXML;

// export Slick

if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);


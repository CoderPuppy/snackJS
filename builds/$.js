/* $.js written by Drew Young
* Includes sizzle, snackJs' core.js and ready function,
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

(function() {
  Sizzle.selectors = {
    order: [ "ID", "NAME", "TAG" ],

    match: {
      ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
      NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
      ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
      TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
      CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
      POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
      PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
    },

    leftMatch: {},

    attrMap: {
      "class": "className",
      "for": "htmlFor"
    },

    attrHandle: {
      href: function( elem ) {
        return elem.getAttribute( "href" );
      },
      type: function( elem ) {
        return elem.getAttribute( "type" );
      }
    },

    relative: {
      "+": function(checkSet, part){
        var isPartStr = typeof part === "string",
        isTag = isPartStr && !rNonWord.test( part ),
        isPartStrNotTag = isPartStr && !isTag;

        if ( isTag ) {
          part = part.toLowerCase();
        }

        for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
          if ( (elem = checkSet[i]) ) {
            while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

            checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
            elem || false :
            elem === part;
          }
        }

        if ( isPartStrNotTag ) {
          Sizzle.filter( part, checkSet, true );
        }
      },

      ">": function( checkSet, part ) {
        var elem,
        isPartStr = typeof part === "string",
        i = 0,
        l = checkSet.length;

        if ( isPartStr && !rNonWord.test( part ) ) {
          part = part.toLowerCase();

          for ( ; i < l; i++ ) {
            elem = checkSet[i];

            if ( elem ) {
              var parent = elem.parentNode;
              checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
            }
          }

        } else {
          for ( ; i < l; i++ ) {
            elem = checkSet[i];

            if ( elem ) {
              checkSet[i] = isPartStr ?
              elem.parentNode :
              elem.parentNode === part;
            }
          }

          if ( isPartStr ) {
            Sizzle.filter( part, checkSet, true );
          }
        }
      },

      "": function(checkSet, part, isXML){
        var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

        if ( typeof part === "string" && !rNonWord.test( part ) ) {
          part = part.toLowerCase();
          nodeCheck = part;
          checkFn = dirNodeCheck;
        }

        checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
      },

      "~": function( checkSet, part, isXML ) {
        var nodeCheck,
        doneName = done++,
        checkFn = dirCheck;

        if ( typeof part === "string" && !rNonWord.test( part ) ) {
          part = part.toLowerCase();
          nodeCheck = part;
          checkFn = dirNodeCheck;
        }

        checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
      }
    },

    find: {
      ID: function( match, context, isXML ) {
        if ( typeof context.getElementById !== "undefined" && !isXML ) {
          var m = context.getElementById(match[1]);
          // Check parentNode to catch when Blackberry 4.6 returns
          // nodes that are no longer in the document #6963
          return m && m.parentNode ? [m] : [];
        }
      },

      NAME: function( match, context ) {
        if ( typeof context.getElementsByName !== "undefined" ) {
          var ret = [],
          results = context.getElementsByName( match[1] );

          for ( var i = 0, l = results.length; i < l; i++ ) {
            if ( results[i].getAttribute("name") === match[1] ) {
              ret.push( results[i] );
            }
          }

          return ret.length === 0 ? null : ret;
        }
      },

      TAG: function( match, context ) {
        if ( typeof context.getElementsByTagName !== "undefined" ) {
          return context.getElementsByTagName( match[1] );
        }
      }
    },
    preFilter: {
      CLASS: function( match, curLoop, inplace, result, not, isXML ) {
        match = " " + match[1].replace( rBackslash, "" ) + " ";

        if ( isXML ) {
          return match;
        }

        for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
          if ( elem ) {
            if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
              if ( !inplace ) {
                result.push( elem );
              }

            } else if ( inplace ) {
              curLoop[i] = false;
            }
          }
        }

        return false;
      },

      ID: function( match ) {
        return match[1].replace( rBackslash, "" );
      },

      TAG: function( match, curLoop ) {
        return match[1].replace( rBackslash, "" ).toLowerCase();
      },

      CHILD: function( match ) {
        if ( match[1] === "nth" ) {
          if ( !match[2] ) {
            Sizzle.error( match[0] );
          }

          match[2] = match[2].replace(/^\+|\s*/g, '');

          // parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
          var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
            !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

          // calculate the numbers (first)n+(last) including if they are negative
          match[2] = (test[1] + (test[2] || 1)) - 0;
          match[3] = test[3] - 0;
        }
        else if ( match[2] ) {
          Sizzle.error( match[0] );
        }

        // TODO: Move to normal caching system
        match[0] = done++;

        return match;
      },

      ATTR: function( match, curLoop, inplace, result, not, isXML ) {
        var name = match[1] = match[1].replace( rBackslash, "" );
			
        if ( !isXML && Expr.attrMap[name] ) {
          match[1] = Expr.attrMap[name];
        }

        // Handle if an un-quoted value was used
        match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

        if ( match[2] === "~=" ) {
          match[4] = " " + match[4] + " ";
        }

        return match;
      },

      PSEUDO: function( match, curLoop, inplace, result, not ) {
        if ( match[1] === "not" ) {
          // If we're dealing with a complex expression, or a simple one
          if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
            match[3] = Sizzle(match[3], null, null, curLoop);

          } else {
            var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

            if ( !inplace ) {
              result.push.apply( result, ret );
            }

            return false;
          }

        } else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
          return true;
        }
			
        return match;
      },

      POS: function( match ) {
        match.unshift( true );

        return match;
      }
    },
	
    filters: {
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
    },
    setFilters: {
      first: function( elem, i ) {
        return i === 0;
      },

      last: function( elem, i, match, array ) {
        return i === array.length - 1;
      },

      even: function( elem, i ) {
        return i % 2 === 0;
      },

      odd: function( elem, i ) {
        return i % 2 === 1;
      },

      lt: function( elem, i, match ) {
        return i < match[3] - 0;
      },

      gt: function( elem, i, match ) {
        return i > match[3] - 0;
      },

      nth: function( elem, i, match ) {
        return match[3] - 0 === i;
      },

      eq: function( elem, i, match ) {
        return match[3] - 0 === i;
      }
    },
    filter: {
      PSEUDO: function( elem, match, i, array ) {
        var name = match[1],
        filter = Expr.filters[ name ];

        if ( filter ) {
          return filter( elem, i, match, array );

        } else if ( name === "contains" ) {
          return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

        } else if ( name === "not" ) {
          var not = match[3];

          for ( var j = 0, l = not.length; j < l; j++ ) {
            if ( not[j] === elem ) {
              return false;
            }
          }

          return true;

        } else {
          Sizzle.error( name );
        }
      },

      CHILD: function( elem, match ) {
        var type = match[1],
        node = elem;

        switch ( type ) {
          case "only":
          case "first":
            while ( (node = node.previousSibling) )	 {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            if ( type === "first" ) {
              return true;
            }

            node = elem;

          case "last":
            while ( (node = node.nextSibling) )	 {
              if ( node.nodeType === 1 ) {
                return false;
              }
            }

            return true;

          case "nth":
            var first = match[2],
            last = match[3];

            if ( first === 1 && last === 0 ) {
              return true;
            }
					
            var doneName = match[0],
            parent = elem.parentNode;
	
            if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
              var count = 0;
						
              for ( node = parent.firstChild; node; node = node.nextSibling ) {
                if ( node.nodeType === 1 ) {
                  node.nodeIndex = ++count;
                }
              }

              parent.sizcache = doneName;
            }
					
            var diff = elem.nodeIndex - last;

            if ( first === 0 ) {
              return diff === 0;

            } else {
              return ( diff % first === 0 && diff / first >= 0 );
            }
        }
      },

      ID: function( elem, match ) {
        return elem.nodeType === 1 && elem.getAttribute("id") === match;
      },

      TAG: function( elem, match ) {
        return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
      },
		
      CLASS: function( elem, match ) {
        return (" " + (elem.className || elem.getAttribute("class")) + " ")
        .indexOf( match ) > -1;
      },

      ATTR: function( elem, match ) {
        var name = match[1],
        result = Expr.attrHandle[ name ] ?
        Expr.attrHandle[ name ]( elem ) :
        elem[ name ] != null ?
        elem[ name ] :
        elem.getAttribute( name ),
        value = result + "",
        type = match[2],
        check = match[4];

        return result == null ?
        type === "!=" :
        type === "=" ?
        value === check :
        type === "*=" ?
        value.indexOf(check) >= 0 :
        type === "~=" ?
        (" " + value + " ").indexOf(check) >= 0 :
        !check ?
        value && result !== false :
        type === "!=" ?
        value !== check :
        type === "^=" ?
        value.indexOf(check) === 0 :
        type === "$=" ?
        value.substr(value.length - check.length) === check :
        type === "|=" ?
        value === check || value.substr(0, check.length + 1) === check + "-" :
        false;
      },

      POS: function( elem, match, i, array ) {
        var name = match[2],
        filter = Expr.setFilters[ name ];

        if ( filter ) {
          return filter( elem, i, match, array );
        }
      }
    }
  };
})();

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
/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
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
			return "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE

window.Sizzle = Sizzle;

})();


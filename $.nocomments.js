
if (!Array.prototype.indexOf)
{
  Array.prototype.indexOf = function(searchElement )
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
      if (n !== n) 
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
  Array.prototype.every = function(fun )
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



if (typeof Object.create != 'function'){
  
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
      if (obj.length === void+0){ 
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
      
      if (typeof json != 'string')
        return;

      json = json.replace(/^\s+|\s+$/g, '');

      var isValid = /^[\],:{}\s]*$/.test(json.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ""));

      if (!isValid)
        throw "Invalid JSON";

      var JSON = window.JSON; 
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
      string.length >= 3) { 
      return true;
    } else { 
      return false;
    }
  }

  function fireEvent(element,event){
    var evt;
    if (document.createEventObject){
      
      evt = document.createEventObject();
      return element.fireEvent('on'+event,evt);
    } else {
      
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(event, true, true ); 
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
          if(html(selector)) { 
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
      if(engine && engine.query && $.isFunction(engine.query) && engine.filter && $.isFunction(engine.filter)) {
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
          var res = Sizzle.matches(callback, array);
          rtnData = wrap ? $(res) : res;
          break;
        case 'object':
          $.each(array, function(o, i) {
            if(!(callback(o,i)))
              delete array[i];
          });
          break;
        case 'array':
        default:
          $.each(array, function(o, i) {
            if(!(callback(o, i)))
              array.slice(i, 1);
          });
          break;
      }
      
      return rtnData;
    },
    
    map: function( elems, callback, arg ) {
      var value, key, ret = [],
      i = 0,
      length = elems.length,
      
      isArray = elems instanceof $.fn || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

      
      if ( isArray ) {
        for ( ; i < length; i++ ) {
          value = callback( elems[ i ], i, arg );

          if ( value != null ) {
            ret[ ret.length ] = value;
          }
        }

        
        return ret.concat.apply( [], ret );
        
      
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
            rtnData = getter(o);

            return false;
          }
        });
      } else {
        rtnData = getter(objs);
      }

      return rtnData;
    },
    
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
    
    extend: function(obj, extender) {
      return (extender ? snack.extend(obj, extender) : snack.extend($, obj));
    },
    
    publisher: function() {
      return snack.publisher.apply(snack, arguments);
    },
    
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
    
    _internal: {
      selector: {
        query: function(selector, context, results) {
          if(typeof context == "string")
            context = Sizzle(context)[0];
          return Sizzle(selector, context || document, results);
        },
        filter: function(selector, elems) {
          return Sizzle.matches(selector, elems);
        }
      }
    },
    
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
        
        elem = elem.replace(rxhtmlTag, "<$1></$2>");

        
        var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
        wrap = wrapMap[ tag ] || wrapMap._default,
        depth = wrap[0],
        div = context.createElement("div");

        
        div.innerHTML = wrap[1] + elem + wrap[2];

        
        while ( depth-- ) {
          div = div.lastChild;
        }

        
        if ( !$.support.tbody ) {

          
          var hasBody = rtbody.test(elem),
          tbody = tag === "table" && !hasBody ?
          div.firstChild && div.firstChild.childNodes :

          
          wrap[1] === "<table>" && !hasBody ?
          div.childNodes :
          [];

          for ( var j = tbody.length - 1; j >= 0 ; --j ) {
            if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
              tbody[ j ].parentNode.removeChild( tbody[ j ] );
            }
          }
        }

        
        if ( !$.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
          div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
        }

        elem = div.childNodes;
      }
      return elem;
    },
    
    create: function(elem) {
      return $($.createNodeList(elem));
    },
    
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
    
    toString: function() {
      var string = "$(", els = this.get();
      string += els.join(', ');
      string += ')'
      return string;
    },
    toArray: function() {
      return Array.prototype.slice.call(this, 0);
    },
    
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
      var whatsToAdd = getElementsToAdd(this, element);
      if(whatsToAdd == "html") {
        whatsToAdd = getElementsToAdd(this, $.createNodeList(element));
      }
      this.each(function(el) {
        var thisEl = this;
        $.each(whatsToAdd, function(appendel) {
          thisEl.appendChild(appendel);
        });
      });

      return this;
    },
    
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
  
  rmultiselector = /,/,
  slice = Array.prototype.slice,
  
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
      NAME: /\[name=[_1305396204125165"]*\]/,
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

          
          var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
            match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
            !/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

          
          match[2] = (test[1] + (test[2] || 1)) - 0;
          match[3] = test[3] - 0;
        }
        else if ( match[2] ) {
          Sizzle.error( match[0] );
        }

        
        match[0] = done++;

        return match;
      },

      ATTR: function( match, curLoop, inplace, result, not, isXML ) {
        var name = match[1] = match[1].replace( rBackslash, "" );
			
        if ( !isXML && Expr.attrMap[name] ) {
          match[1] = Expr.attrMap[name];
        }

        
        match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

        if ( match[2] === "~=" ) {
          match[4] = " " + match[4] + " ";
        }

        return match;
      },

      PSEUDO: function( match, curLoop, inplace, result, not ) {
        if ( match[1] === "not" ) {
          
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

      
      div.setAttribute("className", "t");
      div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

      all = div.getElementsByTagName( "*" );
      a = div.getElementsByTagName( "a" )[ 0 ];

      
      if ( !all || !all.length || !a ) {
        return {};
      }

      
      select = document.createElement( "select" );
      opt = select.appendChild( document.createElement("option") );
      input = div.getElementsByTagName( "input" )[ 0 ];

      support = {
        
        leadingWhitespace: ( div.firstChild.nodeType === 3 ),

        
        
        tbody: !div.getElementsByTagName( "tbody" ).length,

        
        
        htmlSerialize: !!div.getElementsByTagName( "link" ).length,

        
        
        style: /top/.test( a.getAttribute("style") ),

        
        
        hrefNormalized: ( a.getAttribute( "href" ) === "/a" ),

        
        
        
        opacity: /^0.55$/.test( a.style.opacity ),

        
        
        cssFloat: !!a.style.cssFloat,

        
        
        
        checkOn: ( input.value === "on" ),

        
        
        optSelected: opt.selected,

        
        getSetAttribute: div.className !== "t",

        
        submitBubbles: true,
        changeBubbles: true,
        focusinBubbles: false,
        deleteExpando: true,
        noCloneEvent: true,
        inlineBlockNeedsLayout: false,
        shrinkWrapBlocks: false,
        reliableMarginRight: true
      };

      
      input.checked = true;
      support.noCloneChecked = input.cloneNode( true ).checked;

      
      
      select.disabled = true;
      support.optDisabled = !opt.disabled;

      
      
      try {
        delete div.test;
      } catch( e ) {
        support.deleteExpando = false;
      }

      if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
        div.attachEvent( "onclick", function click() {
          
          
          support.noCloneEvent = false;
          div.detachEvent( "onclick", click );
        });
        div.cloneNode( true ).fireEvent( "onclick" );
      }

      
      
      input = document.createElement("input");
      input.value = "t";
      input.setAttribute("type", "radio");
      support.radioValue = input.value === "t";

      input.setAttribute("checked", "checked");
      div.appendChild( input );
      fragment = document.createDocumentFragment();
      fragment.appendChild( div.firstChild );

      
      support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

      div.innerHTML = "";

      
      div.style.width = div.style.paddingLeft = "1px";

      
      body = document.createElement( "body" );
      bodyStyle = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        
        background: "none"
      };
      for ( i in bodyStyle ) {
        body.style[ i ] = bodyStyle[ i ];
      }
      body.appendChild( div );
      document.documentElement.appendChild( body );

      
      
      support.appendChecked = input.checked;

      support.boxModel = div.offsetWidth === 2;

      if ( "zoom" in div.style ) {
        
        
        
        
        div.style.display = "inline";
        div.style.zoom = 1;
        support.inlineBlockNeedsLayout = ( div.offsetWidth === 2 );

        
        
        div.style.display = "";
        div.innerHTML = "<div style='width:4px;'></div>";
        support.shrinkWrapBlocks = ( div.offsetWidth !== 2 );
      }

      div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
      tds = div.getElementsByTagName( "td" );

      
      
      
      
      
      
      
      isSupported = ( tds[ 0 ].offsetHeight === 0 );

      tds[ 0 ].style.display = "";
      tds[ 1 ].style.display = "none";

      
      
      support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );
      div.innerHTML = "";

      
      
      
      
      
      if ( document.defaultView && document.defaultView.getComputedStyle ) {
        marginDiv = document.createElement( "div" );
        marginDiv.style.width = "0";
        marginDiv.style.marginRight = "0";
        div.appendChild( marginDiv );
        support.reliableMarginRight =
        ( parseInt( document.defaultView.getComputedStyle( marginDiv, null ).marginRight, 10 ) || 0 ) === 0;
      }

      
      body.innerHTML = "";
      document.documentElement.removeChild( body );

      
      
      
      
      
      
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
    var idx = this.indexOf(el); 
    var rtn = this[idx];
    if(idx!=-1) this.splice(idx, 1); 
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
      onReady: function(res) {console.log(res);}
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

(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|[_1305396204125325_1305396204125326]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;





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
		NAME: /\[name=[_1305396204125340"]*\]/,
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

				
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				
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





try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;


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

		
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		
		
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

		
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		
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


Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};



(function(){
	
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	
	root.insertBefore( form, root.firstChild );

	
	
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

	
	root = form = null;
})();

(function(){
	
	

	
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			
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

	
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		
		
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			
			
			if ( !seed && !Sizzle.isXML(context) ) {
				
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					
					
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						
						
						if ( elem && elem.parentNode ) {
							
							
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

		
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		
		
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			
			
			matches.call( document.documentElement, "[test!='']:sizzle" );
	
		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						
						if ( ret || !disconnectedMatch ||
								
								
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

	
	
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	
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
	
	
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	
	
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



window.Sizzle = Sizzle;

})();



(function(/*snack, window*/) {
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
    if(/\[object HTML(.*)Element.*\]/.test(type) && !class2type[type]) {
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
    nodeName: function(elem, name) {
      return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase();
    },
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
      isArray = elems instanceof $.fn || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || $.isArray( elems ) ) ;

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
      var rtnData = null, prop;
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
              rtnData = eval("(" + object.toString() + ")");
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
      return typeof thing == "undefined";
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
            if ( $.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
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
        //console.log(el)
        var thisEl = el;
        for(var i = whatsToAdd.length - 1; i >= 0; i--) {
          //console.log($.copy(whatsToAdd[i]), thisEl.firstChild);
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
          thisEl.appendChild($.copy(appendel));
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
      return $.nth( elem, 2, "nextSibling" );
    },
    prev: function( elem ) {
      return $.nth( elem, 2, "previousSibling" );
    },
    nextAll: function( elem ) {
      return $.dir( elem, "nextSibling" );
    },
    prevAll: function( elem ) {
      return $.dir( elem, "previousSibling" );
    },
    siblings: function( elem ) {
      return $.sibling( elem.parentNode.firstChild, elem );
    },
    children: function( elem ) {
      return $.sibling( elem.firstChild );
    },
    contents: function( elem ) {
      return $.nodeName( elem, "iframe" ) ?
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

// css engine here
// $.support.js here
// $.ajax.js here
})(/*window.snack, window*/);
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
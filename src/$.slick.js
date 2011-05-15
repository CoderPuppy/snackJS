(function(/*snack, $, document*/) {
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
        }
        levelEl = preEls[0];
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
        }
        levelEl = addEls[0];
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
            } else {
              rtnEls = [elem];
            }
            levelEl = elem;
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
})(/*window.snack, window.$, document*/);
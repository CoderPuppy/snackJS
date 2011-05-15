

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

var escapeRegExp = function(string){
	return string.replace(/[-[\]{}()*+?.\\^$|,#\s]/g, "\\$&");
};

var regexp = new RegExp(

	"^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|:+(<unicode>+)(?:\\((?:([\"']?)((?:\\([^\\)]+\\)|[^\\(\\)]*)+)\\12)\\))?)"
	
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



var Slick = exports.Slick || {};

Slick.parse = function(expression){
	return parse(expression);
};

Slick.escapeRegExp = escapeRegExp;

if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);


(function(){
	
var exports = this;

var local = {};

var timeStamp = +new Date();



local.isNativeCode = function(fn){
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
};

local.isXML = function(document){
	return (!!document.xmlVersion) || (!!document.xml) || (Object.prototype.toString.call(document) === '[object XMLDocument]') ||
	(document.nodeType === 9 && document.documentElement.nodeName !== 'HTML');
};

local.setDocument = function(document){
	
	
	
	if (document.nodeType === 9); 
	else if (document.ownerDocument) document = document.ownerDocument; 
	else if (document.navigator) document = document.document; 
	else return;
	
	
	
	if (this.document === document) return;
	this.document = document;
	var root = this.root = document.documentElement;
	
	
	
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
		
		
		testNode.appendChild(document.createComment(''));
		starSelectsComments = (testNode.getElementsByTagName('*').length > 0);
		
		
		try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.getElementsByTagName('*');
			starSelectsClosed = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		this.brokenStarGEBTN = starSelectsComments || starSelectsClosed;
		
		
		if (testNode.querySelectorAll) try {
			testNode.innerHTML = 'foo</foo>';
			selected = testNode.querySelectorAll('*');
			this.starSelectsClosedQSA = (selected && selected.length && selected[0].nodeName.charAt(0) == '/');
		} catch(e){};
		
		
		try {
			id = 'idgetsname' + timeStamp;
			testNode.innerHTML = ('<a name='+id+'></a><b id='+id+'></b>');
			this.idGetsName = testNode.ownerDocument.getElementById(id) === testNode.firstChild;
		} catch(e){};
		
		
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
		
		
		try {
			testNode.innerHTML = '<a class="a"></a><a class="f b a"></a>';
			brokenSecondClassNameGEBCN = (testNode.getElementsByClassName('a').length != 2);
		} catch(e){};
		
		this.brokenGEBCN = cachedGetElementsByClassName || brokenSecondClassNameGEBCN;
		
		this.root.removeChild(testNode);
		testNode = null;
		
	}
	
	
	
	this.contains = (root && this.isNativeCode(root.contains)) ? function(context, node){ 
		return context.contains(node);
	} : (root && root.compareDocumentPosition) ? function(context, node){
		return context === node || !!(context.compareDocumentPosition(node) & 16);
	} : function(context, node){
		if (node) do {
			if (node === context) return true;
		} while ((node = node.parentNode));
		return false;
	};
	
	
	
	
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
	


local.search = function(context, expression, append, first){
	
	var found = this.found = (first) ? null : (append || []);
	
	

	if (!context) return found; 
	if (context.navigator) context = context.document; 
	else if (!context.nodeType) return found; 

	
	
	var parsed, i, l;

	this.positions = {};
	var uniques = this.uniques = {};
	
	if (this.document !== (context.ownerDocument || context)) this.setDocument(context);

	
	
	if (typeof expression == 'string'){ 
		
		

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
	} else if (expression == null){ 
		return found;
	} else if (expression.Slick){ 
		parsed = expression;
	} else if (this.contains(context.documentElement || context, expression)){ 
		(found) ? found.push(expression) : found = expression;
		return found;
	} else { 
		return found;
	}
		
	
	
	var shouldUniques = !!(append && append.length);
	
	
	this.push = this.pushUID;
	if (!shouldUniques && (first || (parsed.length == 1 && parsed.expressions[0].length == 1))) this.push = this.pushArray;
	
	if (found == null) found = [];
	
	
	if (shouldUniques) for (i = 0, l = found.length; i < l; i++) this.uniques[this.getUID(found[i])] = true;
	
	
	
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
	if (tag && tag == '*' && (node.nodeType != 1 || node.nodeName.charCodeAt(0) == 47)) return false; 
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

	' ': function(node, tag, id, parts, classes, attributes, pseudos){ 
		
		var i, l, item, children;

		if (!this.isXMLDocument){
			getById: if (id){
				item = this.document.getElementById(id);
				if ((!item && node.all) || (this.idGetsName && item && item.getAttributeNode('id').nodeValue != id)){
					
					
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
	
	'!': function(node, tag, id, parts){  
		while ((node = node.parentNode)) if (node !== document) this.push(node, tag, id, parts);
	},

	'>': function(node, tag, id, parts){ 
		if ((node = node.firstChild)) do {
			if (node.nodeType === 1) this.push(node, tag, id, parts);
		} while ((node = node.nextSibling));
	},
	
	'!>': function(node, tag, id, parts){ 
		node = node.parentNode;
		if (node !== document) this.push(node, tag, id, parts);
	},

	'+': function(node, tag, id, parts){ 
		while ((node = node.nextSibling)) if (node.nodeType === 1){
			this.push(node, tag, id, parts);
			break;
		}
	},

	'!+': function(node, tag, id, parts){ 
		while ((node = node.previousSibling)) if (node.nodeType === 1){
			this.push(node, tag, id, parts);
			break;
		}
	},

	'^': function(node, tag, id, parts){ 
		node = node.firstChild;
		if (node){
			if (node.nodeType === 1) this.push(node, tag, id, parts);
			else this['combinator:+'](node, tag, id, parts);
		}
	},

	'!^': function(node, tag, id, parts){ 
		node = node.lastChild;
		if (node){
			if (node.nodeType === 1) this.push(node, tag, id, parts);
			else this['combinator:!+'](node, tag, id, parts);
		}
	},

	'~': function(node, tag, id, parts){ 
		while ((node = node.nextSibling)){
			if (node.nodeType !== 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, parts);
		}
	},

	'!~': function(node, tag, id, parts){ 
		while ((node = node.previousSibling)){
			if (node.nodeType !== 1) continue;
			var uid = this.getUID(node);
			if (this.bitUniques[uid]) break;
			this.bitUniques[uid] = true;
			this.push(node, tag, id, parts);
		}
	},
	
	'++': function(node, tag, id, parts){ 
		this['combinator:+'](node, tag, id, parts);
		this['combinator:!+'](node, tag, id, parts);
	},

	'~~': function(node, tag, id, parts){ 
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
	
	
	var method = this.attributeGetters[name];
	if (method) return method.call(node);
	var attributeNode = node.getAttributeNode(name);
	return attributeNode ? attributeNode.nodeValue : null;
};



local.overrides = [];

local.override = function(regexp, method){
	this.overrides.push({regexp: regexp, method: method});
};

local.override(/./, function(expression, found, first){ 

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

local.override(/^[\w-]+$|^\*$/, function(expression, found, first){ 
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

local.override(/^\.[\w-]+$/, function(expression, found, first){ 
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

local.override(/^#[\w-]+$/, function(expression, found, first){ 
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



var Slick = local.Slick = exports.Slick || {};

Slick.version = '0.9dev';



Slick.search = function(context, expression, append){
	return local.search(context, expression, append);
};

Slick.find = function(context, expression){
	return local.search(context, expression, null, true);
};



Slick.contains = function(container, node){
	local.setDocument(container);
	return local.contains(container, node);
};



Slick.getAttribute = function(node, name){
	return local.getAttribute(node, name);
};



Slick.match = function(node, selector){
	if (!(node && selector)) return false;
	if (!selector || selector === node) return true;
	if (typeof selector != 'string') return false;
	local.setDocument(node);
	return local.matchNode(node, selector);
};



Slick.defineAttributeGetter = function(name, fn){
	local.attributeGetters[name] = fn;
	return this;
};

Slick.lookupAttributeGetter = function(name){
	return local.attributeGetters[name];
};



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



Slick.override = function(regexp, fn){
	local.override(regexp, fn);
	return this;
};



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



if (!exports.Slick) exports.Slick = Slick;
	
}).apply((typeof exports != 'undefined') ? exports : this);


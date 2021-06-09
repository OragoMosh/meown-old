function a0(x) {return /[^a-z0-9]/i.test(x);}
function html_check(x) {return /<\s*[^>]*>/g.test(x);}
function caps(text){return text.charAt(0).toUpperCase() + text.slice(1);}
function loop(script,delay,amount){
	if (amount>0)
		setTimeout(function(){ amount--;loop(script,delay,amount);eval(script) }, delay);
}
var pon = function(input){return !isNaN(input) ? input > 0 ? 1 : -1:0;}
var ipon = function(input){return !isNaN(input) ? input < 0 ? 1 : -1:0;}
var integ = function(input){return Math.floor(input/16)}
var mergeArrays = function(/**/){
    var
    args = arguments,
    result = "";
    
    for(var i=0; i<args.length; i++){
        result += args[i].toString();
        if (i<args.length-1){
        	result+= ",";
        }
    }
    return result;
}
function max(input,max,result){if (!max)max = 10;result = max;if (input < max)result = input;return result;}
function fix_end(x) {var i=0;for (i = 0; i < x.length; i++) {if (x.endsWith(",") || x.endsWith(" ")) {x = x.slice(0, -1);fix_end(x);}else return x;}}
function new_el(values){if (!values)values = {element:"a",type:"double",value:undefined,class:undefined,style:undefined,id:undefined,tags:undefined};var result,beginning,middle,end;beginning=`<${values.element} `;if(!values.element)values.element=`a`;if(values.class)beginning+=`class="${values.class}"`;if(values.style)beginning+=`class="${values.style}"`;if(values.id){beginning+=`class="${values.id}"`;beginning+=`>`;}if (values.value){middle=values.value;result = beginning;}if (middle)result+=middle;if (values.type === "double"){end = `</${values.element}>`;result+=end;}return result;}

function reSymbol(input,oldString1,oldString2,newString1,newString2){
  var regex = new RegExp(`${oldString1}\s*(.*?)\s*${oldString2}`, "g");

  oldString1 = oldString1||"```"; oldString2 = oldString2||"```";
  newString1 = newString1||"^^"; newString2 = newString2||"^^";
  var matches = [],
    matchesResult = {},
    m;

  while (m = regex.exec(input)) {
    matches.push(m[0]);
  }

  matches.forEach((e)=>{
  var e1 = e,
    e2 = e;
  e2 = e2.replace("```",newString1);
  e2 = e2.replace("```",newString2);
  matchesResult[e1] = e2;
  })

  Object.keys(matchesResult).forEach((e)=>{
  input=input.replace(e,matchesResult[e])
  })

  return input;
}

function mention(input,user){
var regex = new RegExp(`@\s*(.*?)\s* `, "g");

var matches = [],
	matchesResult = {},
  m;
while (m = regex.exec(input)) {
  matches.push(m[0]);
}

matches.forEach((e)=>{
var e1 = e,
	e2 = e;
    
e2 = e2.replace(" ",`</span>`).replace("@",`<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/u/${e1.replace("@","").replace(" ","")}');">@`);
matchesResult[e1] = e2;
})

Object.keys(matchesResult).forEach((e)=>{
input=input.replace(e,matchesResult[e])
})

return input;
}

function getUrlv1(url){
var parser = document.createElement('a');
parser.href = url;
parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/";
return parser;
}

function getUrlv2(url){
var parser = document.createElement('a');
parser.href = url;
parser.isValid = parser.valid = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g.test(url);

parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/";

return parser;
}
function getUrl(url){
var parser = document.createElement('a');
parser.href = url;
parser.isValid = parser.valid = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g.test(url);

parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/";

return parser;
}
function search(param){
  let paramQuery = (new URL(document.location)).searchParams;
  function getUrl(url){ var parser = document.createElement('a'); parser.href = url; parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/"; return parser; }
  
  var result = {};
  if ( paramQuery.get( param ) !== null)
    result.query = paramQuery.get( param );
  
  if ( getUrl(window.location.href).hash !== null)
    result.hash = getUrl(window.location.href).hash;
  
  if ( getUrl(window.location.href).protocol !== null)
    result.protocol = getUrl(window.location.href).protocol;
  
  if ( getUrl(window.location.href).pathname !== null){
  var items = getUrl(window.location.href).pathname.split("/");
  items.forEach((e,i)=>{ if (e.length <=0) items.splice(i,1) });
  result.path = items;
  }
  return result;
}
module.exports = {a0,html_check,max,fix_end,caps,new_el};
//Minified functions

/* Function - a0 checks if string is anything a-z and 0-9 */
function a0(x) {return /[^a-z0-9]/i.test(x);}

/* Function -  Checks if string includes <html> </tags>*/
function htmlCheck(x) {return /<\s*[^>]*>/g.test(x);}

/* Function -  Makes the first letter uppercase*/
function caps(text){return text.charAt(0).toUpperCase() + text.slice(1);}

/* Function -  Returns the maximum number possible out of the given*/
function max(input,max,result){if (!max)max = 10;result = max;if (input < max)result = input;return result;}

/* Function -  Removes exta spaces and commas from a sentences*/
function fixEnd(x) {var i=0;for (i = 0; i < x.length; i++) {if (x.endsWith(",") || x.endsWith(" ")) {x = x.slice(0, -1);fixEnd(x);}else return x;}}

/* Function -  Creates a simple element */
function newEl(values){if (!values)values = {element:"a",type:"double",value:undefined,class:undefined,style:undefined,id:undefined,tags:undefined};var result,beginning,middle,end;beginning=`<${values.element} `;if(!values.element)values.element=`a`;if(values.class)beginning+=`class="${values.class}"`;if(values.style)beginning+=`class="${values.style}"`;if(values.id){beginning+=`class="${values.id}"`;beginning+=`>`;}if (values.value){middle=values.value;result = beginning;}if (middle)result+=middle;if (values.type === "double"){end = `</${values.element}>`;result+=end;}return result;}

/* Function -  Loops a function a certain amount of times */
function loop(script,delay,amount){if (amount>0)setTimeout(function(){ amount--;loop(script,delay,amount);eval(script) }, delay);}

/* Function -  Returns 1 if positive and -1 if negative, or 0 if not a number */
function pon(input){return !isNaN(input) ? input > 0 ? 1 : -1:0;}

/* Function -  Does the opposite of pon(), Returns -1 if positive and 1 if negative, or 0 if not a number */
function ipon(input){return !isNaN(input) ? input < 0 ? 1 : -1:0;}

/* Function -  Rounds to the nearest bit integer*/
function integ(input,bits){return Math.floor(input/bits)}

/* Function -  Returns an array from multiple exisiting ones*/
function mergeArrays(/**/){ var args = arguments, result = "";for(var i=0; i<args.length; i++){ result += args[i].toString(); if (i<args.length-1){ result+= ","; } } return result;}

function reSymbol(input,oldString1,oldString2,newString1,newString2){var regex = new RegExp(`${oldString1}\s*(.*?)\s*${oldString2}`, "g");oldString1 = oldString1||"```"; oldString2 = oldString2||"```";newString1 = newString1||"^^"; newString2 = newString2||"^^";var matches = [],matchesResult = {},m;    while (m = regex.exec(input)) {matches.push(m[0]);};matches.forEach((e)=>{var e1 = e,e2 = e;e2 = e2.replace(oldString1,newString1);e2 = e2.replace(oldString2,newString2);matchesResult[e1] = e2;});Object.keys(matchesResult).forEach((e)=>{input=input.replace(e,matchesResult[e]);});return input;}
  
function mention(input,user){var regex = new RegExp(`@\s*(.*?)\s* `, "g"),matches = [], matchesResult = {}, m;while (m = regex.exec(input)) {matches.push(m[0]);};matches.forEach((e)=>{var e1 = e,e2 = e;e2 = e2.replace(" ",`</span>`).replace("@",`<span class="simple-tag simple-small simple-theme-l1 simple-round" onclick="location.replace('/u/${e1.replace("@","").replace(" ","")}');">@`);matchesResult[e1] = e2;});Object.keys(matchesResult).forEach((e)=>{input=input.replace(e,matchesResult[e]);});return input;}

function forEvery( index, length, evaluate ){ if ( ( index / length ).toString().indexOf( ".") == -1){ eval( evaluate ) }; };

function getUrl(url){ var parser = document.createElement('a'); parser.href = url; parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/"; return parser; }

function search(param){ let paramQuery = (new URL(document.location)).searchParams; function getUrl(url){ var parser = document.createElement('a'); parser.href = url; parser.path = parser.pathname.substring(0, parser.pathname.lastIndexOf('/')) + "/"; return parser; } var result = {}; if ( paramQuery.get( param ) !== null) result.query = paramQuery.get( param ); if ( getUrl(window.location.href).hash !== null) result.hash = getUrl(window.location.href).hash; if ( getUrl(window.location.href).protocol !== null) result.protocol = getUrl(window.location.href).protocol; if ( getUrl(window.location.href).pathname !== null){ var items = getUrl(window.location.href).pathname.split("/"); items.forEach((e,i)=>{ if (e.length <=0) items.splice(i,1) }); result.path = items; } return result; }

module.exports = {a0,htmlCheck,max,fixEnd,caps,newEl,loop,pon,ipon,integ,mergeArrays,reSymbol,mention,forEvery,getUrl, search};
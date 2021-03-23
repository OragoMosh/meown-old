function a0(x) {return /[^a-z0-9]/i.test(x);}
function html_check(x) {return /<\s*[^>]*>/g.test(x);}
function caps(text){return text.charAt(0).toUpperCase() + text.slice(1);}
function max(input,max,result){if (!max)max = 10;result = max;if (input < max)result = input;return result;}
function fix_end(x) {var i=0;for (i = 0; i < x.length; i++) {if (x.endsWith(",") || x.endsWith(" ")) {x = x.slice(0, -1);fix_end(x);}else return x;}}
function new_el(values){if (!values)values = {element:"a",type:"double",value:undefined,class:undefined,style:undefined,id:undefined,tags:undefined};var result,beginning,middle,end;beginning=`<${values.element} `;if(!values.element)values.element=`a`;if(values.class)beginning+=`class="${values.class}"`;if(values.style)beginning+=`class="${values.style}"`;if(values.id){beginning+=`class="${values.id}"`;beginning+=`>`;}if (values.value){middle=values.value;result = beginning;}if (middle)result+=middle;if (values.type === "double"){end = `</${values.element}>`;result+=end;}return result;}
module.exports = {a0,html_check,max,fix_end,caps,new_el};
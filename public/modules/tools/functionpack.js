function a0(x) {return /[^a-z0-9]/i.test(x);}
function html_check(x) {return /<\s*[^>]*>/g.test(x);}
function max(input,max,result){if (!max){max = 10}result = max;if (input < max){result = input;}return result;}
module.exports = {a0,html_check,max};
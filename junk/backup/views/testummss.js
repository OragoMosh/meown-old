var objectList = {
hmm:"hey!"
}
function varlist(listObject,variables){
if (!listObject&&!variables&&!variables[0])return;
variables.forEach(variable => {
var listObject.[variable]="hey"
	})
}
myFunction()
function myFunction() {
  document.getElementById("demo").innerHTML = JSON.stringify(objectList)
}








<!DOCTYPE html>
<html>
<head>
<style>
.democlass {
  color: red;
}
</style>
</head>
<body>

<h1 class="democlass" mmm="beep beep beep">Hello World</h1>

<p>Click the button to display the value of the class attribute of the h1 element.</p>

<button onclick="myFunction()">Try it</button>

<p id="demo"></p>

<script>
var objectList = {
hmm:"hey!"
}
function varlist(values){

if (!values.variable&&!values.list&&!values.list[0])return;
values.list.forEach(item => {
values.variable[item]="hey"
	})
}
myFunction()
function myFunction() {
varlist({variable:objectList,["hmm","hey"]})
  document.getElementById("demo").innerHTML = JSON.stringify(objectList)
}
</script>

</body>
</html>

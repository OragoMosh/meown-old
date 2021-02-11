<!DOCTYPE html>
<html>
<body>

<p>Access an array value of a JSON object.</p>

<p id="demo"></p>

<script>
var game, map, player, display;

display = "";

player = {
symbol:"x"
}

map = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1]
]
game = {map:map}

function exists_player(){
    var i = 0;
    var found = false;
    while (i <map.length&&found===false) {
    
    if (map[i].includes("x")){
    found=true;
    return {result:true,x:map[i].indexOf(player.symbol),y:i};
    }
      i++;
    }
    return {result:false}
}


if(exists_player().result){
player.x = exists_player().x;
player.y = exists_player().y;
}
else
{
new_player();
}


function new_player(){
var i = 0, found = false;
while (i <map.length&&found===false) {
if (map[0][i]===0||map[0][i]==="0"){
map[0][i]="L";found=true;player.x = 0;player.y = 0;
}//end of if statement.
i++
}// end of while.
}// end of new_player function.

map.forEach(draw);


function draw(input){
display += `${input}<br>`
}
display+=`<br> Idk`
document.getElementById("demo").innerHTML = display;
</script>

</body>
</html>

  
  
  <!DOCTYPE html>
<html>
<body>
<p id="demo"></p>

<script>
var game, map, player, display;

display = "";

player = {
symbol:"x"
}

map = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[1,1,1,1,1,1,1,1,1,1]
]
game = {map:map}

function exists_player(){
    var i = 0;
    var found = false;
    while (i <map.length&&found===false) {
    
    if (map[i].includes(player.symbol)){
    found=true;
    return {result:true,x:map[i].indexOf(player.symbol),y:i};
    }
      i++;
    }
    return {result:false}
}


if(exists_player().result){
player.x = exists_player().x;
player.y = exists_player().y;
}
else
{
new_player();
}


function new_player(){
var i = 0, found = false;
while (i <map.length&&found===false) {
if (map[0][i]===0||map[0][i]==="0"){
map[0][i]=player.symbol;found=true;player.x = 0;player.y = 0;
}//end of if statement.
i++
}// end of while.
setInterval(function(){ physics() }, 500);
}// end of new_player function.

map.forEach(draw);



function physics(){
if (player.y){
alert(player.y)
}
}

function draw(input){
display += `${input}<br>`
}
display+=`<br> Idk`
document.getElementById("demo").innerHTML = display;
</script>

</body>
</html>

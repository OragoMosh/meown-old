window.addEventListener("load", function () {
  color_load();
  if (document.getElementsByTagName("BODY"))checkHttps();
  loaded();
})

function checkHttps(){if(location.protocol.toString()==="http:") location.replace(`https://${location.hostname}${location.pathname}`);}

reset_colors();
function reset_colors(){
/*colors = {"1":"#FFFFFF","2":"#dfe5e8","3":"#becbd2","4":"#9eb1bb","5":"#7d97a5",
          "6":"#57707d","7":"#4d636f","8":"#435761","9":"#3a4b53","10":"#303e45",
          "11":"#303e45","12":"#7d97a5","13":"#000000","14":"#FFFFFF","15":"#ff5252"}*/
colors = {"1":"#a6a6a6","2":"#dfe5e8","3":"#becbd2","4":"#9eb1bb","5":"#3f4040",
         "6":"#57707d","7":"#1e1f1f","8":"#435761","9":"#3a4b53","10":"#191a1a",
         "11":"#141414","12":"#3b3e3f","13":"#000000","14":"#707070","15":"#ff5252"}
}

var color_list = document.getElementsByClassName("colors"),
    color_length =  Object.keys(colors).length+1;
var r = document.querySelector(':root'),
    rs = getComputedStyle(r);

var colors = {}

  var i;for (i = 0; i < color_length; i++) {
    colors[i]="black";
  }


function color_get() {
reset_colors();
var i=1;
while (i < color_length) {
var color = color_list[i-1];
var c = colors[i]
color.value = c;
  i++
  }
}

function color_save() {
var i=1;
while (i < color_length) {
  colors[i] = color_list[i-1].value;
  
  i++
  }
localStorage.setItem('color-palette', JSON.stringify(colors));
}
  
function color_copy(){
  document.getElementById("colors").innerHTML = `<input id="color_values">`;
  document.getElementById("color_values").value = localStorage.getItem('color-palette');
  //notification("It should copy automatically, but if not manually copy the input bar.")
  var cb = document.getElementById("cb");
  cb.value = localStorage.getItem('color-palette');
  cb.style.display='block';
  cb.select();
  document.execCommand('copy');
  cb.style.display='none';
 }
  
function color_paste(){
  localStorage.setItem('color-palette', prompt("colors?"));
  color_load();
  //notification("Saved!")
}
  
function color_load() {
var i=1;
while (i < color_length) {
var loaded_colors="";
var color = color_list[i-1];
if (localStorage.getItem('color-palette')){
loaded_colors = JSON.parse(localStorage.getItem('color-palette'));
if (color)color.value = loaded_colors[i];
r.style.setProperty(`--${i}`, loaded_colors[i]);
}
  i++
  }
}


function speak(speakingLang,voiceID){
  var synth = window.speechSynthesis,
      utter = new SpeechSynthesisUtterance("hey"),
      voices = synth.getVoices();
  if(!voiceID||!isNaN(Number(voiceID))){voiceID=0;}
  utter.voice = voices[voiceID];
  utter.text = speakingLang;
  synth.speak(utter);
}

async function infoData(x,values) {
  var result=``;
  //var projectName = await fetch(`/api/config`).then(l => l.json()).then(l => l.response).then(function(response){return response.name})
  if (!values){values = {}}
  values.description = `The newest, worst social media.`;
  alert("1")
  result = `
<title>${await fetch(`/api/config`).then(l => l.json()).then(l => l.response).then(function(response){return response.name})} | ${x}</title>
<meta property="og:title" content="${await fetch(`/api/config`).then(l => l.json()).then(l => l.response).then(function(response){return response.name})} | ${x}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://meown.tk" />
<meta property="og:image" content="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664" />
<meta property="og:description" content="${values.description}" />
<meta name="theme-color" content="#cb3837">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">
<link id="favicon" rel="icon" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png" type="image/x-icon">
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="manifest" href="/manifest.json">
<script>if ("serviceWorker" in navigator) {navigator.serviceWorker.register("/service-worker.js");}</script>

`;
  alert("hmu")
  if (values&&values.hostname){result+=`<link rel="canonical" href="https://${values.hostname}">`;}
  return result;
  
}

var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition,
    recognition = new SpeechRecognition();

var synth = window.speechSynthesis,
    utter = new SpeechSynthesisUtterance("hey");
			/* JS comes here */
var output = document.getElementById("output"),
    action = document.getElementById("action"),
    microphone = document.getElementById("microphone");

function stopSpeechRecognition(){
  action.innerHTML = "<small>stopped listening, hope you are done...</small>";
  microphone.innerHTML = `<i class="fa fa-microphone fa-fw simple-margin-right"></i>`;
  microphone.onclick = function () { runSpeechRecognition(); }; 
  recognition.stop();
}
		    function runSpeechRecognition() {
		        // get output div reference
		         output = document.getElementById("output");
		        // get action element reference
		         action = document.getElementById("action");
             microphone = document.getElementById("microphone");
                // new speech recognition object  
                recognition.continuous = true;
                recognition.lang = "en";
                recognition.interimResults = false;
                recognition.maxAlternatives=1;
                
                // This runs when the speech recognition service starts
                recognition.onstart = function() {
                    action.innerHTML = "<small>listening, please speak...</small>";
                    microphone.innerHTML = `<i class="fa fa-microphone-slash fa-fw simple-margin-right"></i>`;
                    microphone.onclick = function () { stopSpeechRecognition(); }; 
                };
                
                recognition.onspeechend = function() {
                    stopSpeechRecognition();
                }
              function voice_reply(text){
                
utter.text = text;
synth.speak(utter);

              }
                // This runs when the speech recognition service returns result
                recognition.onresult = function(event) {
                    var transcript = event.results[event.results.length-1][0].transcript.trim();
                    var confidence = event.results[event.results.length-1][0].confidence;
                  
if (transcript==="stop"){
  recognition.stop();
  return voice_reply("Voice commands stopped");
}else
  if (transcript==="open dashboard"){
  recognition.stop();
  output.innerHTML = `<meta http-equiv="Refresh" content="0; url='/dashboard'"/>`;
  return voice_reply("Opening Meown Dashboard");
}else
  if (transcript==="logout"){
  recognition.stop();
  output.innerHTML = `<meta http-equiv="Refresh" content="0; url='/logout'"/>`;
  return voice_reply("Logging out");
}else
  if (transcript.lastIndexOf("hi my name is")===0) {
recognition.stop();
var text = "is";var pos = transcript.lastIndexOf(text)+text.length;
var name= transcript.slice(pos,Infinity);
voice_reply("Nice to meet you"+name);
}else utter.text = `No results for ${transcript}`;synth.speak(utter);
                  
                    //output.innerHTML = "<b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence*100+"%"+"<br>"+JSON.stringify(event.results[event.results.length-1]);
                    //output.classList.remove("hide");
                };
              
                 // start recognition
                 recognition.start();
	        }






function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}

async function share(values){
  try {
    await navigator.share({ title: "Example Page", url: "" });
    console.log("Data was shared successfully");
  } catch (err) {
    console.error("Share failed:", err.message);
  }
}

  function copy(txt){
  var cb = document.getElementById("cb");
  cb.value = txt;
  cb.style.display='block';
  cb.select();
  document.execCommand('copy');
  cb.style.display='none';
    

 }
let params = (new URL(document.location)).searchParams;
var popup_status = false;

window.addEventListener("load", function () {/*Start - If website Loaded*/

});
function loaded(){
  if (!document.getElementById("assets")){
    document.querySelectorAll('body')[0].innerHTML+='<div id="assets">\</div>';loaded();
  }
  else if (document.getElementById("notification")===null&&document.getElementById("assets"))
document.getElementById("assets").innerHTML+= '<div id="notification">\</div>';/*Add popup notification box*/
//document.getElementById("assets").innerHTML+= '<script onload="check_https()">check_https();function check_https(){if(location.protocol.toString()==="http:"){location.replace(`https://${location.hostname}${location.pathname}`);}}</script>'

  if (params.get('notification')==null) notification('Page Loaded!')
  else notification(params.get('notification'));
  document.getElementById("notification").style.backgroundColor = "#333"
}
function notification(text,time) {
  if (time==null) time = 2000;
if (popup_status !== true){
	popup_status = true;
	var popup = document.getElementById("notification");
	popup.className = "show";
	popup.innerHTML = text
	setTimeout(function(){ popup.className = popup.className.replace("show", "");popup_status=false;}, time);
  } 
}
info_data("hmm")
function info_data(x,values) {
  var result, 
      project_name = "Meown", 
      head = document.querySelectorAll('head')[0]||document.querySelectorAll('head');
  
  if (!head&&head.getAttribute("title"))return;
  if (!values)values = {};
  
  values.title=head.getAttribute("title")
  
  values.description = `The newest, worst social media.`
  result = `
<title>${project_name} | ${values.title}</title>
<meta property="og:title" content="${project_name} | ${values.title}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://meown.tk" />
<meta property="og:image" content="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664" />
<meta property="og:description" content="${values.description}" />
<meta name="theme-color" content="#cb3837">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">
<link id="favicon" rel="icon" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png" type="image/x-icon">
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="manifest" href="/manifest.json">
<script>if ("serviceWorker" in navigator) {navigator.serviceWorker.register("/service-worker.js");}</script>
`;
    if (values&&values.hostname)result+=`<link rel="canonical" href="https://${values.hostname}">`;
   head.innerHTML+=(result)
}

function toggleClass(element,className) {
  var temp = element;
  temp.className.indexOf(className) == -1?
  temp.className += ` ${className}`:
  temp.className = temp.className.replace(` ${className}`, "");
}



    /*window.onbeforeunload = confirmExit;
    function confirmExit() {
        return "You have attempted to leave this page. Are you sure?";
    }
    */
class User {
  constructor(database, minibase,username,community,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar) {
    this.data = database;
    this.mini = minibase;
    this.username=username;
    this.community=community;
    this.currency=currency;
    this.scripts=scripts;
    this.status=status;
    this.info_data=info_data;
    this.nav=nav;
    this.nav_mobile=nav_mobile;
    this.badge_list=badge_list;
    this.follow_amount=follow_amount;
    this.follow_list=follow_list;
    this.community_list=community_list;
    this.profile_menu=profile_menu;
    this.post_bar=post_bar;
    this.post_list=post_list;
    this.side_bar=side_bar;
    this.self_avatar=self_avatar;
    this.self_link=self_link;
    
  }

  u() {
    return `<!DOCTYPE html>
<script>
${this.scripts}
/*var nameval = '';
if('${this.username}'!=='undefined'){nameval='Username: ${this.username}'}else{nameval='not logged in'};
alert(nameval);
*/
let params = (new URL(document.location)).searchParams;
var popup_status = false;
window.addEventListener("load", function () {/*Start - If website Loaded*/
if (document.getElementById("popup")===null){/*Start - If variable popup equals null*/
document.getElementById("assets").innerHTML+= '<div id="popup">\</div>';/*Add popup notification box*/
}
if (params.get('notification')==null){notification('Page Loaded!')}else{notification(params.get('notification'));}
  document.getElementById("popup").style.backgroundColor = "#333"
});
function notification(text,time) {
  if (time==null){
    time = 2000
  }
if (popup_status !== true){
	popup_status = true;
	var popup = document.getElementById("popup");
	popup.className = "show";
	popup.innerHTML = text
	setTimeout(function(){ popup.className = popup.className.replace("show", "");popup_status=false;}, time);
  } 
}
</script>
<html>
${this.info_data(`User: ${this.username}`)}
<meta charset="UTF-8">
<link href="../tools.css" rel="stylesheet" >
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="simple.css">
<link rel="stylesheet" href="simple-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>html, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}</style>
<body class="simple-theme-l5" style="background-image: linear-gradient(rgba(77, 99, 111,1),rgba(77, 99, 111,1),rgba(77, 99, 111,0.8));">
<!-- Navbar -->
<div class="simple-top">
 <div class="simple-bar simple-theme-d2 simple-left-align simple-large" style="background-image: linear-gradient(rgba(77, 99, 111,0.8),rgba(77, 99, 111,1),rgba(64, 82, 92,0.5));">
  <a class="simple-bar-item simple-hide-medium simple-hide-large simple-right simple-large" href="javascript:void(0);" onclick="openNav()"><img src="${this.self_avatar}" class="simple-circle" style="height:30px;width:30px" alt="Avatar"></a>
  <a href="../" class="simple-bar-item simple-button simple-padding-large simple-theme-d4"><i class="fa fa-home simple-margin-right"></i>Meown</a>
  <!--
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="News"><i class="fa fa-globe"></i></a>
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
  -->
<a class="simple-hide-small">
<form method="get" action="/u" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding" placeholder="Find User" style="width:20vw;"></input></form>
<form method="get" action="/c" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding" placeholder="Find Community" style="width:20vw;"></input></form>
${this.nav}</a>
  <div class="simple-dropdown-hover simple-hide-small">
    <button class="simple-button simple-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="simple-badge simple-right simple-small simple-green">3</span></button>     
    <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;">
      <a href="#" class="simple-bar-item simple-button">Item-1</a>
      <a href="#" class="simple-bar-item simple-button">Item-2</a>
      <a href="#" class="simple-bar-item simple-button">Item-3</a>
    </div>
  </div>
  <div onclick=location.replace('https://'+window.location.hostname+'${this.self_link}') style="background-image: linear-gradient(rgba(77, 99, 111,0.8),rgba(77, 99, 111,1),rgba(64, 82, 92,0.5));" class="simple-bar-item simple-button simple-hide-small simple-right simple-padding-large simple-hover-white simple-dropdown-hover" title="My Account" >
${this.profile_menu}
    <img src="${this.self_avatar}" class="simple-circle" style="height:23px;width:23px" alt="Avatar">
  </div>
 </div>
</div>
<!-- Navbar on small screens -->
<div id="navDemo" class="simple-bar-block simple-theme-d2 simple-hide simple-hide-large simple-hide-medium simple-large">
  <a href="javascript:void(0);" class="simple-bar-item simple-button simple-padding-large">Hidden</a>
  <a>
  <form method="get" action="/u" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding"  placeholder="Find User" style="width:69vw;"></input></form>
  <form method="get" action="/c" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding"  placeholder="Find Community" style="width:69vw;"></input></form>
  ${this.nav_mobile}</a>
  <a href="../" class="simple-bar-item simple-button simple-padding-large">Chat Room</a>
  <a href="${this.self_link}" class="simple-bar-item simple-button simple-padding-large">${this.status}</a>
</div>
<!-- Page Container -->
<div class="simple-container simple-content" style="max-width:1400px;margin-top:80px">    
  <!-- The Grid -->
  <div class="simple-row">
    <!-- Left Column -->
    <div class="simple-col m3">
      <!-- Profile -->
      <!--<div class="simple-card simple-round simple-white">-->
      <div class="simple-card simple-round" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) ),url('${this.data.user[this.username].background}');background-color:white;">
      <div class="simple-container"><br> 
      <div class="simple-card simple-round" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) )">
        <div class="simple-container">
         <h4 class="simple-center" style="color:${this.data.user[this.username].color}">${this.data.user[this.username].preferred} </h4>
         <p class="simple-center"><img src="${`${this.data.user[this.username].avatar}`}" class="simple-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         <p><i class="fa fa-user fa-fw simple-margin-right simple-text-theme"></i> ${this.username}</p>
         <!--<p><i class="fa fa-comment fa-fw simple-margin-right simple-text-theme"></i> ${this.data.user[this.username].description}</p>-->
         <p><i class="fa fa-birthday-cake fa-fw simple-margin-right simple-text-theme"></i> ${this.data.user[this.username].creation_date}</p>
        <p><i class="fa fa-money fa-fw simple-margin-right simple-text-theme"></i> ${this.currency}: ${this.data.user[this.username].coins}</p>
        <p><i class="fa fa-star fa-fw simple-margin-right simple-text-theme"></i> Experience: ${this.data.user[this.username].xp}</p>
        </div>
      </div>
      </div>
      <br>
      </div>
      <br>
      
      <!-- Accordion -->
      <div class="simple-card simple-round">
        <div class="simple-white">
          <button onclick="accordion('Demo1')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Badges</button>
          <div id="Demo1" class="simple-hide simple-container">
            <p>${this.badge_list}</p>
          </div>
          <button onclick="accordion('Demo2')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-heart fa-fw simple-margin-right"></i> Follows</button>
          <div id="Demo2" class="simple-hide simple-container">
            <p>Followers: ${this.follow_amount}</p>
            <p>Following: ${this.follow_list} </p>
            <p>Communities: ${this.community_list} </p>
          </div>
        </div>      
      </div>
      <br>
      
      <!-- Interests --> 
      <div class="simple-card simple-round simple-white simple-hide-small">
        <div class="simple-container">
          <p>Interests</p>
          <p></p>
        </div>
      </div>
      <br>
      
      <!-- Alert Box -->
      <div class="simple-container simple-display-container simple-round simple-theme-l4 simple-border simple-theme-border simple-margin-bottom simple-hide-small">
        <span onclick="this.parentElement.style.display='none'" class="simple-button simple-theme-l3 simple-display-topright">
          <i class="fa fa-remove"></i>
        </span>
        <p><strong>Hello!</strong></p>
        <p>This is a notification box which currently has no use :p</p>
      </div>
    
    <!-- End Left Column -->
    </div>
    
    <!-- Middle Column -->
    <div class="simple-col m7">
    ${this.post_bar}
<!--
        <div class="simple-container simple-card simple-white simple-round simple-margin"><br>
        <img src="https://images.vexels.com/media/users/3/163191/isolated/lists/3404f798db8118b2a5bd33cab9c1455c-leather-stitch-badge.png" alt="Badge Card" class="simple-left simple-circle simple-margin-right" style="width:60px">
        <h4>User Badges</h4><br>
        <p>Badges: ${this.badge_list}</p>
      </div> -->
<div class="simple-container simple-card simple-white simple-round simple-margin" style="background-image: url('${this.data.user[this.username].banner}');background-color:white;">
<div class="simple-container simple-card simple-round simple-margin" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) );">
        <h4>[About me]</h4><br>
        <p>${this.data.user[this.username].description}</p>
        </div>
      </div>
    ${this.post_list}
    <!-- End Middle Column -->
    </div>
    
    <!-- Right Column -->
    <div class="simple-col m2">
${this.side_bar}
      <div class="simple-card simple-round simple-white simple-padding-16 simple-center">
      <p>ADS</p></div>
      <br>
      <div class="simple-card simple-round simple-white simple-padding-32 simple-center">
        <p><i class="fa fa-bug simple-xxlarge"></i><br>Report bugs</p>
      </div>
    <!-- End Right Column -->
    </div>
  <!-- End Grid -->
  </div>
<!-- End Page Container -->
</div>
<br>
<script>
// Accordion
function accordion(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("simple-show") == -1) {
    x.className += " simple-show";
    x.previousElementSibling.className += " simple-theme-d1";
  } else { 
    x.className = x.className.replace("simple-show", "");
    x.previousElementSibling.className = 
    x.previousElementSibling.className.replace(" simple-theme-d1", "");
  }
}
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("simple-show") == -1) {
    x.className += " simple-show";
  } else { 
    x.className = x.className.replace(" simple-show", "");
  }
}
</script>
</body>
</html>
<div id="assets"></div><!--Loads the extra files that aren't written in the document.-->
`;
  }
  
  
  
  
  
  
  
  
    s() {
    return `<!DOCTYPE html>
<script>
${this.scripts}
/*var nameval = '';
if('${this.username}'!=='undefined'){nameval='Username: ${this.username}'}else{nameval='not logged in'};
alert(nameval);
*/
let params = (new URL(document.location)).searchParams;
var popup_status = false;
window.addEventListener("load", function () {/*Start - If website Loaded*/
if (document.getElementById("popup")===null){/*Start - If variable popup equals null*/
document.getElementById("assets").innerHTML+= '<div id="popup">\</div>';/*Add popup notification box*/
}
if (params.get('notification')==null){notification('Page Loaded!')}else{notification(params.get('notification'));}
  document.getElementById("popup").style.backgroundColor = "#333"
});
function notification(text,time) {
  if (time==null){
    time = 2000
  }
if (popup_status !== true){
	popup_status = true;
	var popup = document.getElementById("popup");
	popup.className = "show";
	popup.innerHTML = text
	setTimeout(function(){ popup.className = popup.className.replace("show", "");popup_status=false;}, time);
  } 
}
</script>
<html>
${this.info_data(`User: ${this.username}`)}
<meta charset="UTF-8">
<link href="../tools.css" rel="stylesheet" >
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="simple.css">
<link rel="stylesheet" href="simple-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>html, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}</style>
<body class="simple-theme-l5" style="background-image: linear-gradient(rgba(77, 99, 111,1),rgba(77, 99, 111,1),rgba(77, 99, 111,0.8));">
<!-- Navbar -->
<div class="simple-top">
 <div class="simple-bar simple-theme-d2 simple-left-align simple-large" style="background-image: linear-gradient(rgba(77, 99, 111,0.8),rgba(77, 99, 111,1),rgba(64, 82, 92,0.5));">
  <a class="simple-bar-item simple-hide-medium simple-hide-large simple-right simple-large" href="javascript:void(0);" onclick="openNav()"><img src="${this.self_avatar}" class="simple-circle" style="height:30px;width:30px" alt="Avatar"></a>
  <a href="../" class="simple-bar-item simple-button simple-padding-large simple-theme-d4"><i class="fa fa-home simple-margin-right"></i>Meown</a>
  <!--
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="News"><i class="fa fa-globe"></i></a>
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
  <a href="#" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
  -->
<a class="simple-hide-small">${this.nav}</a>
  <div class="simple-dropdown-hover simple-hide-small">
    <button class="simple-button simple-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="simple-badge simple-right simple-small simple-green">3</span></button>     
    <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;">
      <a href="#" class="simple-bar-item simple-button">Item-1</a>
      <a href="#" class="simple-bar-item simple-button">Item-2</a>
      <a href="#" class="simple-bar-item simple-button">Item-3</a>
    </div>
  </div>
  <div onclick=location.replace('https://'+window.location.hostname+'${this.self_link}') style="background-image: linear-gradient(rgba(77, 99, 111,0.8),rgba(77, 99, 111,1),rgba(64, 82, 92,0.5));" class="simple-bar-item simple-button simple-hide-small simple-right simple-padding-large simple-hover-white simple-dropdown-hover" title="My Account" >
${this.profile_menu}
    <img src="${this.self_avatar}" class="simple-circle" style="height:23px;width:23px" alt="Avatar">
  </div>
 </div>
</div>
<!-- Navbar on small screens -->
<div id="navDemo" class="simple-bar-block simple-theme-d2 simple-hide simple-hide-large simple-hide-medium simple-large">
  <a href="javascript:void(0);" class="simple-bar-item simple-button simple-padding-large">Hidden</a>
  <a>${this.nav_mobile}</a>
  <a href="../" class="simple-bar-item simple-button simple-padding-large">Chat Room</a>
  <a href="${this.self_link}" class="simple-bar-item simple-button simple-padding-large">${this.status}</a>
</div>
<!-- Page Container -->
<div class="simple-container simple-content" style="max-width:1400px;margin-top:80px">    
  <!-- The Grid -->
  <div class="simple-row">
    <!-- Left Column -->
    <div class="simple-col m3">
      <!-- Profile -->
      <!--<div class="simple-card simple-round simple-white">-->
      <div class="simple-card simple-round" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) ),url('${this.data.community[this.community].background}');background-color:white;">
      <div class="simple-container"><br> 
      <div class="simple-card simple-round" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) )">
        <div class="simple-container">
         <h4 class="simple-center" >${this.data.community[this.community].preferred} </h4>
         <p class="simple-center"><img src="${`${this.data.community[this.community].avatar}`}" class="simple-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         <p><i class="fa fa-user fa-fw simple-margin-right simple-text-theme"></i> ${this.community}</p>
         <!--<p><i class="fa fa-comment fa-fw simple-margin-right simple-text-theme"></i> ${this.data.community[this.community].description}</p>-->
         <p><i class="fa fa-birthday-cake fa-fw simple-margin-right simple-text-theme"></i> ${this.data.community[this.community].creation_date}</p>
        </div>
      </div>
      </div>
      <br>
      </div>
      <br>
      
      <!-- Accordion -->
      <!--<div class="simple-card simple-round">
        <div class="simple-white">
          <button onclick="accordion('Demo2')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-heart fa-fw simple-margin-right"></i> Follows</button>
          <div id="Demo2" class="simple-hide simple-container">
            <p>Followers: ${this.follow_amount}</p>
          </div>
        </div>      
      </div>
      <br>-->
      
      <!-- Interests --> 
      <div class="simple-card simple-round simple-white simple-hide-small">
        <div class="simple-container">
          <p>Members: ${this.follow_amount}</p>
          <p>Creator: ${this.data.community[this.community].owner}</p>
        </div>
      </div>
      <br>
      
      <!-- Alert Box -->
      <div class="simple-container simple-display-container simple-round simple-theme-l4 simple-border simple-theme-border simple-margin-bottom simple-hide-small">
        <span onclick="this.parentElement.style.display='none'" class="simple-button simple-theme-l3 simple-display-topright">
          <i class="fa fa-remove"></i>
        </span>
        <p><strong>Hello!</strong></p>
        <p>This is a notification box which currently has no use :p</p>
      </div>
    
    <!-- End Left Column -->
    </div>
    
    <!-- Middle Column -->
    <div class="simple-col m7">
    ${this.post_bar}
<!--
        <div class="simple-container simple-card simple-white simple-round simple-margin"><br>
        <img src="https://images.vexels.com/media/users/3/163191/isolated/lists/3404f798db8118b2a5bd33cab9c1455c-leather-stitch-badge.png" alt="Badge Card" class="simple-left simple-circle simple-margin-right" style="width:60px">
        <h4>User Badges</h4><br>
        <p>Badges: ${this.badge_list}</p>
      </div> -->
<div class="simple-container simple-card simple-white simple-round simple-margin" style="background-image: url('${this.data.community[this.community].banner}');background-color:white;">
<div class="simple-container simple-card simple-round simple-margin" style="background-image: linear-gradient(45deg, rgba(255,255,255,0.3), rgba(255,255,255,0.3) );">
        <h4>[About me]</h4><br>
        <p>${this.data.community[this.community].description}</p>
        </div>
      </div>
    ${this.post_list}
    <!-- End Middle Column -->
    </div>
    
    <!-- Right Column -->
    <div class="simple-col m2">
${this.side_bar}
      <div class="simple-card simple-round simple-white simple-padding-16 simple-center">
      <p>ADS</p></div>
      <br>
      <div class="simple-card simple-round simple-white simple-padding-32 simple-center">
        <p><i class="fa fa-bug simple-xxlarge"></i><br>Report bugs</p>
      </div>
    <!-- End Right Column -->
    </div>
  <!-- End Grid -->
  </div>
<!-- End Page Container -->
</div>
<br>
<script>
// Accordion
function accordion(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("simple-show") == -1) {
    x.className += " simple-show";
    x.previousElementSibling.className += " simple-theme-d1";
  } else { 
    x.className = x.className.replace("simple-show", "");
    x.previousElementSibling.className = 
    x.previousElementSibling.className.replace(" simple-theme-d1", "");
  }
}
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("simple-show") == -1) {
    x.className += " simple-show";
  } else { 
    x.className = x.className.replace(" simple-show", "");
  }
}
</script>
</body>
</html>
<div id="assets"></div><!--Loads the extra files that aren't written in the document.-->
`;
  }
  
  
  
  
  
  
  
  
  
  slash() {
    return `
<!--Info Fill -->
<!--  Author: Orago <Orago#0051> -->
<!doctype html>
<html lang="En">
<head>
  <meta charset="UTF-8">
  <title>Meown Chat</title>
  <meta property="og:title" content="Meown | Main" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://meown.tk" />
  <meta property="og:image" content="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664" />
  <meta property="og:description" content="The newest, worst social media." />
  <meta name="theme-color" content="#cb3837">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">
  <script src="./index.js" defer></script>
  <link rel="manifest" href="/manifest.json">
  <script>// Register service worker to control making site work offline
if('serviceWorker' in navigator) {
  navigator.serviceWorker
           .register('./sw.js')
           .then(function() { console.log('Service Worker Registered'); });
}</script>

  <link href="style.css" rel="stylesheet" >
  <script src="https://use.typekit.net/ama5eep.js"></script>
  <script>try{Typekit.load({ async: true });}catch(e){}</script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
  <link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="simple.css">
  <link rel="stylesheet" href="simple-theme-blue-grey.css">
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

  <script src="/socket.io/socket.io.js"></script>
  <script src="/main.js"></script>
</head>
<body>
  <ul class="pages" id="all-page">
    <li class="chat page" id="chat-page">
      <div class="chatArea">
        <ul class="messages"></ul>
      </div>
      <button class="btn btn-tips" title="Help">?</button>
      <div id="effect-tips" class="ui-tips">
        <h3 class="tips-title">Help</h3>
        <div class="tips">
          <h3>System Commands</h3>
          <h4>$help or $commands</h4>
          This command will show a list of other commands that can be used<br><br><br>Creator: Orago 
          <br>&nbsp;&lt;<a href="https://mittens.glitch.me">Home Page</a> &gt;<br>
        </div>
      </div>
      <input class="inputMessage" placeholder="Say something..."/>
    </li>
    <li class="login page" id="login-page">

<!-- Navbar -->
<div class="simple-top">
 <div class="simple-bar simple-theme-d2 simple-left-align simple-large">
  <a class="simple-bar-item simple-button simple-hide-medium simple-hide-large simple-right simple-padding-large simple-hover-white simple-large simple-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
  <a class="simple-bar-item simple-button simple-padding-large simple-theme-d4"><i class="fa fa-home simple-margin-right"></i> Mittz Chat</a>
  <a class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white add-button" title="Download the web app"><i class="fa fa-download"></i></a>
  <div onclick=location.replace('https://'+window.location.hostname+'${this.self_link}') class="simple-bar-item simple-button simple-hide-small simple-right simple-padding-large simple-hover-white simple-dropdown-hover" title="My Account">
${this.profile_menu}
    <img src="${this.self_avatar}" class="simple-circle" style="height:23px;width:23px" alt="Avatar">
  </div>
 </div>
</div>
<!-- Navbar on small screens -->
<div id="navDemo" class="simple-bar-block simple-theme-d2 simple-hide simple-hide-large simple-hide-medium simple-large">
  <a href="javascript:void(0);" class="simple-bar-item simple-button simple-padding-large">Hidden</a>
  <a>${this.nav}</a>
  <a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>
  <a href="${this.self_link}" class="simple-bar-item simple-button simple-padding-large">${this.status}</a>
</div>

      <div class="form">
        <h1 class="title">Meown Chat</h1>
        <h3 class="subtitle">Please enter your username.</h3>
        <label>
          <input class="usernameInput" type="text" id="username_input" minlength="1" maxlength="14" title="Nickname is limited to 1 to 14 characters" autofocus/>
        </label>
      </div>
    </li>
    <li class="room page" id="room-page">
      <h1 class="room-title">Room list</h1>
      <p class="room-hint">Click the room block to join the room.</p>
      <ul class="room-list"></ul>
    </li>
  </ul>
</body>
</html>
`;
  }
}


module.exports = User;



class User {
  constructor(database, minibase,username,currency,views,forms,recent_follows,recent_followers,recent_changes) {
    this.data = database;
    this.mini = minibase;
    this.username=username;
    this.currency=currency;
    this.views=views;
    this.forms=forms;
    this.recent_follows=recent_follows;
    this.recent_followers=recent_followers;
    this.recent_changes=recent_changes;
  }

  html() {
    return `
<!DOCTYPE html>
<html>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="simple.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<link href="tools.css" rel="stylesheet" >
<script src="tools.js"></script>
<div id="assets"></div>
<style>
html,body,h1,h2,h3,h4,h5 {font-family: "Raleway", sans-serif}
</style>
<body class="simple-light-grey">

<!-- Top container -->
<div class="simple-bar simple-top simple-black simple-large" style="z-index:4">
  <button class="simple-bar-item simple-button simple-hide-large simple-hover-none simple-hover-text-light-grey" onclick="w3_open();"><i class="fa fa-bars"></i>  Menu</button>
  <span class="simple-bar-item simple-right">Meown Chat</span>
</div>

<!-- Sidebar/menu -->
<nav class="simple-sidebar simple-collapse simple-white simple-animate-left" style="z-index:3;width:300px;" id="mySidebar"><br>
  <div class="simple-container simple-row">
    <div class="simple-col s4">
      <img src="${this.data.user[this.username].avatar}" class="simple-circle simple-margin-right" style="width:46px">
    </div>
    <div class="simple-col s8 simple-bar">
      <span>Welcome, <strong>${this.data.user[this.username].preferred}</strong></span><br>
      <a href="#" class="simple-bar-item simple-button"><i class="fa fa-envelope"></i></a>
      <a href="../u" class="simple-bar-item simple-button"><i class="fa fa-user"></i></a>
      <a href="#" class="simple-bar-item simple-button"><i class="fa fa-cog"></i></a>
    </div>
  </div>
  <hr>
  <div class="simple-container">
    <h5>Dashboard</h5>
  </div>
  <div class="simple-bar-block">
    <a href="#" class="simple-bar-item simple-button simple-padding-16 simple-hide-large simple-dark-grey simple-hover-black" onclick="w3_close()" title="close menu"><i class="fa fa-remove fa-fw"></i>  Close Menu</a>
    <a href="#" class="simple-bar-item simple-button simple-padding simple-blue"><i class="fa fa-users fa-fw"></i>  Overview</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-eye fa-fw"></i>  Views: ${this.views}</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-users fa-fw"></i>  Traffic:${this.data.user[this.username].followers.length}</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-bullseye fa-fw"></i>  Geo</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-diamond fa-fw"></i>  Orders</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-bell fa-fw"></i>  News</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-bank fa-fw"></i>  General</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-history fa-fw"></i>  History</a>
    <a href="#" class="simple-bar-item simple-button simple-padding"><i class="fa fa-cog fa-fw"></i>  Settings</a>
  </div>
</nav>


<!-- Overlay effect when opening sidebar on small screens -->
<div class="simple-overlay simple-hide-large simple-animate-opacity" onclick="w3_close()" style="cursor:pointer" title="close side menu" id="myOverlay"></div>

<!-- !PAGE CONTENT! -->
<div class="simple-main" style="margin-left:300px;margin-top:43px;">

  <!-- Header -->
  <header class="simple-container" style="padding-top:22px">
    <h5><b><i class="fa fa-dashboard"></i> My Dashboard</b></h5>
  </header>

  <div class="simple-row-padding simple-margin-bottom">
<div class="simple-quarter">
      <div class="simple-container simple-orange simple-text-white simple-padding-16">
        <div class="simple-left"><i class="fa fa-users simple-xxxlarge"></i></div>
        <div class="simple-right">
          <h3>${this.data.user[this.username].followers.length}</h3>
        </div>
        <div class="simple-clear"></div>
        <h4>Followers</h4>
      </div>
    </div>
    <div class="simple-quarter">
      <div class="simple-container simple-red simple-padding-16">
        <div class="simple-left"><i class="fa fa-comment simple-xxxlarge"></i></div>
        <div class="simple-right">
          <h3>${this.mini.posts[this.username].length}</h3>
        </div>
        <div class="simple-clear"></div>
        <h4>Posts</h4>
      </div>
    </div>
    <div class="simple-quarter">
      <div class="simple-container simple-blue simple-padding-16">
        <div class="simple-left"><i class="fa fa-money simple-xxxlarge"></i></div>
        <div class="simple-right">
          <h3>${this.data.user[this.username].coins}</h3>
        </div>
        <div class="simple-clear"></div>
        <h4>${this.currency}</h4>
      </div>
    </div>
    <div class="simple-quarter">
      <div class="simple-container simple-teal simple-padding-16">
        <div class="simple-left"><i class="fa fa-star simple-xxxlarge"></i></div>
        <div class="simple-right">
          <h3>${this.data.user[this.username].xp}</h3>
        </div>
        <div class="simple-clear"></div>
        <h4>Experience</h4>
      </div>
    </div>
    
  </div>

  <div class="simple-panel">
    <div class="simple-row-padding" style="margin:0 -16px">
      <div class="simple-third">
        <h5>Background</h5>
        <img src="${this.data.user[this.username].background}" style="width:100%" alt="Your profile Background">
      </div>
      <div class="simple-twothird">
        <h5>Feeds (None of these are functional yet)</h5>
        <table class="simple-table simple-striped simple-white">
          <tr>
            <td><i class="fa fa-user simple-text-blue simple-large"></i></td>
            <td>New record, over 90 views.</td>
            <td><i>10 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-bell simple-text-red simple-large"></i></td>
            <td>Database error.</td>
            <td><i>15 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-users simple-text-yellow simple-large"></i></td>
            <td>New record, over 40 users.</td>
            <td><i>17 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-comment simple-text-red simple-large"></i></td>
            <td>New comments.</td>
            <td><i>25 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-bookmark simple-text-blue simple-large"></i></td>
            <td>Check transactions.</td>
            <td><i>28 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-laptop simple-text-red simple-large"></i></td>
            <td>CPU overload.</td>
            <td><i>35 mins</i></td>
          </tr>
          <tr>
            <td><i class="fa fa-share-alt simple-text-green simple-large"></i></td>
            <td>New shares.</td>
            <td><i>39 mins</i></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
${this.forms}


  <hr>
  <div class="simple-container">
    <h5>General Stats(Currently non functional will do soon if possible)</h5>
    <p>New Visitors</p>
    <div class="simple-grey">
      <div class="simple-container simple-center simple-padding simple-green" style="width:25%">+25%</div>
    </div>

    <p>New Users</p>
    <div class="simple-grey">
      <div class="simple-container simple-center simple-padding simple-orange" style="width:50%">50%</div>
    </div>

    <p>Bounce Rate</p>
    <div class="simple-grey">
      <div class="simple-container simple-center simple-padding simple-red" style="width:75%">75%</div>
    </div>
  </div>
  <hr>


  <hr>
  <div class="simple-container">
    <h5>Recent Changes</h5>
    <ul class="simple-ul simple-card-4 simple-white">
${this.recent_changes}
      <!--<li class="simple-padding-16">
        <img src="/w3images/avatar2.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Mike</span><br>
      </li>
      <li class="simple-padding-16">
        <img src="/w3images/avatar5.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Jill</span><br>
      </li>
      <li class="simple-padding-16">
        <img src="/w3images/avatar6.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Jane</span><br>
      </li>-->
    </ul>
  </div>
  <hr>
<div class="simple-container">
    <h5>Recent Follows</h5>
    <ul class="simple-ul simple-card-4 simple-white">
${this.recent_follows}
      <!--<li class="simple-padding-16">
        <img src="/w3images/avatar2.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Mike</span><br>
      </li>
      <li class="simple-padding-16">
        <img src="/w3images/avatar5.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Jill</span><br>
      </li>
      <li class="simple-padding-16">
        <img src="/w3images/avatar6.png" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge">Jane</span><br>
      </li>-->
    </ul>
  </div>
  <hr>

  <div class="simple-container">
    <h5>Recent Followers</h5>
${this.recent_followers}
<!--
    <div class="simple-row">
      <div class="simple-col m2 text-center">
        <img class="simple-circle" src="/w3images/avatar3.png" style="width:96px;height:96px">
      </div>
      <div class="simple-col m10 simple-container">
        <h4>John <span class="simple-opacity simple-medium">Sep 29, 2014, 9:12 PM</span></h4>
        <p>Keep up the GREAT work! I am cheering for you!! Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><br>
      </div>
    </div>

    <div class="simple-row">
      <div class="simple-col m2 text-center">
        <img class="simple-circle" src="/w3images/avatar1.png" style="width:96px;height:96px">
      </div>
      <div class="simple-col m10 simple-container">
        <h4>Bo <span class="simple-opacity simple-medium">Sep 28, 2014, 10:15 PM</span></h4>
        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><br>
      </div>
    </div>-->
  </div><!-- End page content -->
</div>

<script>
// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}
</script>

</body>
</html>
    `;
  }
  
}


module.exports = User;



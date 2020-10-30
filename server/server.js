// Setup basic express server
const express = require('express');
const fs = require("fs");
const Canvas = require('canvas');
const database_location = __dirname+"/database.json";
const database = JSON.parse(fs.readFileSync(database_location));
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: true });

var port = process.env.PORT || 3232;
var hostname = "mittzchat-beta.glitch.me"; // replace with the web domain you are currently using Ex. google.com which will then be a variable to added to https:// HOSTNAME then whatever redirect it's supposed to be
var currency = "Coins";
var botname = '⚙️ !v! ittz';
var prefix = '$'

var time = new Date();
do_am_pm();
var am_pm;
function do_am_pm(){
  if (time.getHours()-4 < 12){ am_pm = "AM"
  } else if (time.getHours()-4 > 12){ am_pm = "PM"
  } else {am_pm =  "broken??"}
}
server.listen(port, function () {
  console.log('Server listening at port %d', port);
console.log(`Time: ${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`);
});



// Routing
app.use(express.static(__dirname + '/../app'));
app.set('view engine','ejs');
// Chat room

app.get("/data", (request, response) => {response.render('database', {qs: request.query});});

app.post("/result", urlencodedParser, (request, response) => {
  console.log(request.body)
  if ((request.body.sentpass).toLowerCase()==database.passcode){
    response.send(database)
  }
  else {response.send("<br>Password sent: "+(request.body.sentpass).toLowerCase()+"<br>Status: Failed")}
});


app.get("/user", (request, response) => {response.render('user', {qs: request.query});});


app.get("/dashboard", (request, response) => {response.render('dashboard', {qs: request.query});});




app.post("/new-post", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.sentname.toLowerCase())) {
    return response.send('🔏 **Whoops!** There is no such user with this name!<br><br><button onclick="location.replace(`https://`+window.location.hostname+`/register`)">Register an account.</button>');
  }
if (database.user[request.body.sentname.toLowerCase()].password===request.body.sentpass.toLowerCase()){
  if(!database.posts[request.body.sentname.toLowerCase()].includes((request.body.sentpost).toLowerCase())){
  database.posts[request.body.sentname.toLowerCase()].push((request.body.sentpost).toLowerCase());
    database.user[(request.body.sentname).toLowerCase()].coins+=1;
    
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`Your post has been created!<button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">View Post</button>`);
  } else {
    return response.send('**Please do not repost!**<button onclick="location.replace(`https://`+window.location.hostname+`/dasboard`)">Back to dashboard</button>');
  }
}else if (database.user[request.body.sentname.toLowerCase()].password!==request.body.sentpass.toLowerCase()){
  return response.send(`🔏 **Whoops!** Incorrect Password!<br><br><button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">Please try again.</button>`);
}
});

app.post("/delete-post", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.sentname.toLowerCase())) {
    return response.send('🔏 **Whoops!** There is no such user with this name!<br><br><button onclick="location.replace(`https://`+window.location.hostname+`/register`)">Register an account.</button>');
  }
if (database.user[request.body.sentname.toLowerCase()].password===request.body.sentpass.toLowerCase()){
  delete database.posts[request.body.sentname.toLowerCase()][request.body.sentnum];
  database.user[(request.body.sentname).toLowerCase()]-=1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`Ready for the next post?<br><br><button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">New Post</button>`);
}else if (database.user[request.body.sentname.toLowerCase()].password!==request.body.sentpass.toLowerCase()){
  return response.send(`🔏 **Whoops!** Incorrect Password!<br><br><button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">Please try again.</button>`);
}
});


app.post("/user-text", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username.toLowerCase())) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }
response.send(
    `Username: ${request.body.username.toLowerCase()} <br> Description: ${database.user[request.body.username.toLowerCase()].description} 
<br> ${currency}: ${database.user[request.body.sentname.toLowerCase()].coins} <br> Creation Date: ${database.user[request.body.username.toLowerCase()].creation_date}
`
  );
});

app.get("/register", (request, response) => {response.render('register', {qs: request.query});});
  
app.post("/register-status", urlencodedParser, (request, response) => {
  //console.log(request.body);
  if (database.profiles.includes(request.body.sentname)) {return response.send(`🔐 **Whoops!** This username/profile already exists!<br><button onclick="location.replace(https://${hostname}/register)>back</button>`);}
  if (request.body.sentname==null||request.body.sentname==undefined||!request.body.sentname){return response.send(`Invalid/Empty Username<br><button onclick=location.replace(https://${hostname}/register)>back</button>`);}
  if (request.body.sentpass==null||request.body.sentpass==undefined||!request.body.sentpass){return response.send(`Invalid/Empty Password<br><button onclick=location.replace(https://${hostname}/register)>back</button>`);}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(`Invalid/Empty Description<br><button onclick="location.replace(https://${hostname}/register)">back</button>`);}
  if (!database.profiles.includes(request.body.sentname)) {response.send(`Attempting to set up your profile now!<button onclick="location.replace(https://${hostname}/user)">Find user</button>`);
  database.profiles.push((request.body.sentname).toLowerCase());
  database.user[(request.body.sentname).toLowerCase()]=
    {password:(request.body.sentpass).toLowerCase(), coins:50, background:"https://convertingcolors.com/plain-2C2F33.svg", description:(request.body.sentdesc).toLowerCase(), 
     color:"#ffffff", avatar:"https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png", badges:[], /*status:"Default Status Text",*/
     creation_date:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
                                                
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  console.log(`Account created, Username: ${(request.body.sentname).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
  
})




// Total number of users
var numUsers = 0;
// Current room list.
var curRoomList = {};

// Action: Create, Join, Left.
var logCreate = 'Created ';
var logJoin = 'joined ';
var logLeft = 'Left ';

// Location: Lab (main website, can be joined or left),
//           Room (can be created, joined, Left)
var logLab = 'Mittz Chat';
var logRoom = ' room ';

io.on('connection', function (socket) {
  var addedUser = false;
  var curRoomName = 'Lobby';

  
  socket.on('sync', function (data) {
   socket.emit('handshake',database);
  });
  
  
  
  
socket.on('create account', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+" has just registered!"//data
    });
  database.profiles.push(socket.username.toLowerCase());
  database.profiles.push(socket.username.toLowerCase());
  database.user[socket.username.toLowerCase()]=
    {password:socket.username.toLowerCase(), coins:0, background:"https://convertingcolors.com/plain-2C2F33.svg", description:socket.username.toLowerCase(),
     color:"#ffffff", avatar:"cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png", badges:[],creation_date:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  });
  
  /*app.get("/data", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(database);
});*/
  

  socket.on('claim daily', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+` has just collected a daily reward by using ${prefix}daily!`//data
    });
    console.log("ooh shiny,"+socket.username+"claimed their daily bonus!"+data)
  database.user[socket.username.toLowerCase()].last_daily=data;
  database.user[socket.username.toLowerCase()].coins+=50;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  });
  
  socket.on('claim mine', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+` has just collected a daily reward by using ${prefix}daily!`//data
    });
    console.log("Coin mined")
  database.user[socket.username.toLowerCase()].coins+=data;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  });
  
  socket.on('bot message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: data//data
    });
  });
  
  
  socket.on('add coin', function (data) {
    // we tell the client to execute 'new message'
    console.log("testing")
    socket.broadcast.to(curRoomName).emit('new message', {username: botname,message: socket.username+" has just mined a coin!"/*data*/});
  database.coins[socket.username.toLowerCase()]=data;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  });
  
  socket.on('get account', function (data) {
    // we tell the client to execute 'new message'
    (req, res) => res.send('Hello World!')
    socket.broadcast.to(curRoomName).emit('get account', database/*.user[socket.username]*/);
  });
  
    socket.on('get user', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('get account', {
      username: socket.username,
      password: data//data
    });
  });
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: socket.username,
      message: data
    });
  });
  //commands
    socket.on('i-chat', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: data,
      message: socket.username
    });
  });
  
      socket.on('sbot', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: data
    });
  });

  
  
  
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    // Default to join 'Lobby'.
    socket.join(curRoomName);

    // If there is no the same curRoomName in room list, add it to room list.
    // And set user number in it = 1, else user number + 1.
    if (!isRoomExist(curRoomName, curRoomList)) {
      curRoomList[curRoomName] = 1;
    } else {
      ++curRoomList[curRoomName];
    }

    // First join chat room, show current room list.
    socket.emit('show room list', curRoomName, curRoomList);

    socket.emit('login', {
      numUsers: numUsers
    });

    // echo to room (default as 'Lobby') that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      logAction: logJoin,
      logLocation: logLab,
      roomName: '',
      userJoinOrLeftRoom: false
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.to(curRoomName).emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects, perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;
      --curRoomList[curRoomName];

      // If there is no user in room, delete this room,
      // Except this room is 'Lobby'.
      if (curRoomList[curRoomName] === 0 && curRoomName !== 'Lobby') {
        delete curRoomList[curRoomName];
      }

      if (numUsers === 0) {
        curRoomList = {};
      }
      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logLeft,
        logLocation: logLab,
        roomName: ''
      });
    }
  });

  // Show room list to user.
  socket.on('room list', function () {
    socket.emit('show room list', curRoomName, curRoomList);
  });

  socket.on('join room', function (room) {
    socket.emit('stop typing');

    if (room !== curRoomName) {
      // Before join room, first need to leave current room. -------------------
      socket.leave(curRoomName);
      socket.broadcast.to(curRoomName).emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logLeft,
        logLocation: logRoom,
        roomName: '「' + curRoomName + '」',
        userJoinOrLeftRoom: true
      });
      --curRoomList[curRoomName];

      // If there is no user in room, delete this room,
      // Except this room is 'Lobby'.
      if (curRoomList[curRoomName] === 0 && curRoomName !== 'Lobby') {
        delete curRoomList[curRoomName];
      }

      // Then join a new room. -------------------------------------------------
      socket.join(room);

      // If there is no the same room in room list, add it to room list.
      if (!isRoomExist(room, curRoomList)) {
        curRoomList[room] = 1;
        socket.emit('join left result', {
          username: 'you ',
          logAction: logCreate,
          logLocation: logRoom,
          roomName: '「' + room + '」'
        });
      } else {
        ++curRoomList[room];
        socket.emit('join left result', {
          username: 'you ',
          logAction: logJoin,
          logLocation: logRoom,
          roomName: '「' + room + '」'
        });
      }

      // Every time someone join a room, reload current room list.
      socket.emit('show room list', room, curRoomList);
      curRoomName = room;
      socket.broadcast.to(room).emit('user joined', {
        username: socket.username,
        numUsers: numUsers,
        logAction: logJoin,
        logLocation: logRoom,
        roomName: '「' + room + '」',
        userJoinOrLeftRoom: true
      })
    }
  });
});

// Check if roomName is in roomList Object.
function isRoomExist (roomName, roomList) {
  return roomList[roomName] >= 0;
}
  app.post("/user-main", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username.toLowerCase())) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }else
  var post_number, posts_list = "";
  var badge_number, badge_list = "";
  /*for (amount in database.posts) {list +=  "<br>"+database.posts[request.body.username.toLowerCase()][1] ;}
*/
/* Old badges if(typeof database.user[request.body.username.toLowerCase()].badges !== "undefined"){
  for (badge_number in database.user[request.body.username.toLowerCase()].badges) {
    badge_list += database.user[request.body.username.toLowerCase()].badges[badge_number]
  }}*/
    if(database.badges.creator.includes(request.body.username.toLowerCase())){badge_list += "Creator";}
    if(database.badges.developer.includes(request.body.username.toLowerCase())){if(database.badges.creator.includes(request.body.username.toLowerCase())){badge_list += ", "};badge_list += "Developer";}
    if(database.badges.moderator.includes(request.body.username.toLowerCase())){if(database.badges.developer.includes(request.body.username.toLowerCase())){badge_list += ", "};badge_list += "Moderator";}
    if(database.badges.early_member.includes(request.body.username.toLowerCase())){if(database.badges.moderator.includes(request.body.username.toLowerCase())){badge_list += ", "};badge_list += "Early Member";}
    if(database.badges.long_user.includes(request.body.username.toLowerCase())){if(database.badges.early_member.includes(request.body.username.toLowerCase())){badge_list += ", "};badge_list += "Long Time User";}
    if(database.badges.testing.includes(request.body.username.toLowerCase())){if(database.badges.long_user.includes(request.body.username.toLowerCase())){badge_list += ", "};badge_list += "Testing";}
  
    if(typeof database.posts[request.body.username.toLowerCase()] !== "undefined"){
    
  for (post_number in database.posts[request.body.username.toLowerCase()]) {
    posts_list +=  `
<div class="w3-container w3-card w3-white w3-round w3-margin" id="post-${[post_number]}"><br>
        <img src="${`${database.user[request.body.username.toLowerCase()].avatar}`}" alt="User_Avatar" class="w3-circle" style="width:60px">
        <span class="w3-right w3-opacity">#${post_number}</span>
        <h4>${request.body.username.toLowerCase()}</h4><br>
        <hr class="w3-clear">
        <p>${database.posts[request.body.username.toLowerCase()][post_number]}</p>
      </div>  

` ;
  }}
response.send(
    `<!DOCTYPE html>
<html>
<title>Mittz Chat</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>html, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}</style>
<body class="w3-theme-l5">

<!-- Navbar -->
<div class="w3-top">
 <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
  <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i class="fa fa-home w3-margin-right"></i>Mittz Chat</a>
  <!--
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="News"><i class="fa fa-globe"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
  -->
  <div class="w3-dropdown-hover w3-hide-small">
    <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
    <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px">
      <a href="#" class="w3-bar-item w3-button">Item-1</a>
      <a href="#" class="w3-bar-item w3-button">Item-2</a>
      <a href="#" class="w3-bar-item w3-button">Item-3</a>
    </div>
  </div>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="My Account">
    <img src="/w3images/avatar2.png" class="w3-circle" style="height:23px;width:23px" alt="Avatar">
  </a>
 </div>
</div>

<!-- Navbar on small screens -->
<div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Chat-Room</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 2</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 3</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">My Profile</a>
</div>

<!-- Page Container -->
<div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">    
  <!-- The Grid -->
  <div class="w3-row">
    <!-- Left Column -->
    <div class="w3-col m3">
      <!-- Profile -->
      <div class="w3-card w3-round w3-white">
        <div class="w3-container">
         <h4 class="w3-center">${request.body.username.toLowerCase()} </h4>
         <p class="w3-center"><img src="${`${database.user[request.body.username.toLowerCase()].avatar}`}" class="w3-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         <p><i class="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> ${`${database.user[request.body.username.toLowerCase()].description}`}</p>
         <p><i class="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> ${database.user[request.body.username.toLowerCase()].creation_date}</p>
        <p><i class="fa fa-money fa-fw w3-margin-right w3-text-theme"></i> ${database.user[request.body.username.toLowerCase()].coins}</p>
        </div>
      </div>
      <br>
      
      <!-- Accordion -->
      <div class="w3-card w3-round">
        <div class="w3-white">
          <button onclick="accordion('Demo1')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-circle-o-notch fa-fw w3-margin-right"></i> My Groups</button>
          <div id="Demo1" class="w3-hide w3-container">
            <p>Some text..</p>
          </div>
          <button onclick="accordion('Demo2')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i> My Events</button>
          <div id="Demo2" class="w3-hide w3-container">
            <p>Some other text..</p>
          </div>

        </div>      
      </div>
      <br>
      
      <!-- Interests --> 
      <div class="w3-card w3-round w3-white w3-hide-small">
        <div class="w3-container">
          <p>Interests</p>
          <p>
          </p>
        </div>
      </div>
      <br>
      
      <!-- Alert Box -->
      <div class="w3-container w3-display-container w3-round w3-theme-l4 w3-border w3-theme-border w3-margin-bottom w3-hide-small">
        <span onclick="this.parentElement.style.display='none'" class="w3-button w3-theme-l3 w3-display-topright">
          <i class="fa fa-remove"></i>
        </span>
        <p><strong>Hello!</strong></p>
        <p>This is a notification box which currently has no use :p</p>
      </div>
    
    <!-- End Left Column -->
    </div>
    
    <!-- Middle Column -->
    <div class="w3-col m7">
    
      <div class="w3-row-padding">
        <div class="w3-col m12">
          <div class="w3-card w3-round w3-white">
            <div class="w3-container w3-padding">
              <h6 class="w3-opacity">Top text</h6>
              <p contenteditable="true" class="w3-border w3-padding">Useless input bar</p>
              <button type="button" class="w3-button w3-theme"><i class="fa fa-pencil"></i>  Button</button> 
            </div>
          </div>
        </div>
      </div>

        <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
        <img src="https://images.vexels.com/media/users/3/163191/isolated/lists/3404f798db8118b2a5bd33cab9c1455c-leather-stitch-badge.png" alt="Badge Card" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <h4>User Badges</h4><br>
        <p>Badges: ${badge_list}</p>
      </div> 

    ${posts_list}
<!--
      <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
        <img src="" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <span class="w3-right w3-opacity">Timestamp (to be coded)</span>
        <h4>Username (add soon)</h4><br>
        <hr class="w3-clear">
        <p></p>
      </div>-->

    <!-- End Middle Column -->
    </div>
    
    <!-- Right Column -->
    <div class="w3-col m2">

      <br>
      
      <div class="w3-card w3-round w3-white w3-padding-16 w3-center">
        <p>ADS</p></div>
      <br>
      <div class="w3-card w3-round w3-white w3-padding-32 w3-center">
        <p><i class="fa fa-bug w3-xxlarge"></i><br>Report bugs</p>
      </div>
    <!-- End Right Column -->
    </div>
  <!-- End Grid -->
  </div>
<!-- End Page Container -->
</div>
<br>

<footer class="w3-container w3-theme-d5">
  <p>Designed by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
</footer>
 
<script>
// Accordion
function accordion(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-theme-d1";
  } else { 
    x.className = x.className.replace("w3-show", "");
    x.previousElementSibling.className = 
    x.previousElementSibling.className.replace(" w3-theme-d1", "");
  }
}
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}
</script>
</body>
</html> 

`
  
  );
});















app.get("/u", (request, response) => {
  var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  var username = params.slice(params.search("username=")+9,Infinity);
  if (!username) {
    return response.send('🔏 **Whoops!** Please input a username in the url (Ex. https://mittzchat-beta.glitch.me/?username=orago!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }
  if (!database.profiles.includes(username)) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }else
  var post_number, posts_list = "";
  var badge_number, badge_list = "";
    if(database.badges.creator.includes(username)){badge_list += "Creator";}
    if(database.badges.developer.includes(username)){if(database.badges.creator.includes(username)){badge_list += ", "};badge_list += "Developer";}
    if(database.badges.moderator.includes(username)){if(database.badges.developer.includes(username)){badge_list += ", "};badge_list += "Moderator";}
    if(database.badges.early_member.includes(username)){if(database.badges.moderator.includes(username)){badge_list += ", "};badge_list += "Early Member";}
    if(database.badges.long_user.includes(username)){if(database.badges.early_member.includes(username)){badge_list += ", "};badge_list += "Long Time User";}
    if(database.badges.testing.includes(username)){if(database.badges.long_user.includes(username)){badge_list += ", "};badge_list += "Testing";}
  
    if(typeof database.posts[username] !== "undefined"){
    
  for (post_number in database.posts[username]) {
    posts_list +=  `
<div class="w3-container w3-card w3-white w3-round w3-margin" id="post-${[post_number]}"><br>
        <img src="${`${database.user[username].avatar}`}" alt="User_Avatar" class="w3-circle" style="width:60px">
        <span class="w3-right w3-opacity">#${post_number}</span>
        <h4>${username}</h4><br>
        <hr class="w3-clear">
        <p>${database.posts[username][post_number]}</p>
      </div>  

` ;
  }}
response.send(
    `<!DOCTYPE html>
<html>
<title>Mittz Chat</title>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-blue-grey.css">
<link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Open+Sans'>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>html, body, h1, h2, h3, h4, h5 {font-family: "Open Sans", sans-serif}</style>
<body class="w3-theme-l5">

<!-- Navbar -->
<div class="w3-top">
 <div class="w3-bar w3-theme-d2 w3-left-align w3-large">
  <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-theme-d2" href="javascript:void(0);" onclick="openNav()"><i class="fa fa-bars"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large w3-theme-d4"><i class="fa fa-home w3-margin-right"></i>Mittz Chat</a>
  <!--
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="News"><i class="fa fa-globe"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Account Settings"><i class="fa fa-user"></i></a>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Messages"><i class="fa fa-envelope"></i></a>
  -->
  <div class="w3-dropdown-hover w3-hide-small">
    <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
    <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px">
      <a href="#" class="w3-bar-item w3-button">Item-1</a>
      <a href="#" class="w3-bar-item w3-button">Item-2</a>
      <a href="#" class="w3-bar-item w3-button">Item-3</a>
    </div>
  </div>
  <a href="#" class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white" title="My Account">
    <img src="/w3images/avatar2.png" class="w3-circle" style="height:23px;width:23px" alt="Avatar">
  </a>
 </div>
</div>

<!-- Navbar on small screens -->
<div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Chat-Room</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 2</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">Link 3</a>
  <a href="#" class="w3-bar-item w3-button w3-padding-large">My Profile</a>
</div>

<!-- Page Container -->
<div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">    
  <!-- The Grid -->
  <div class="w3-row">
    <!-- Left Column -->
    <div class="w3-col m3">
      <!-- Profile -->
      <div class="w3-card w3-round w3-white">
        <div class="w3-container">
         <h4 class="w3-center">${username} </h4>
         <p class="w3-center"><img src="${`${database.user[username].avatar}`}" class="w3-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         <p><i class="fa fa-home fa-fw w3-margin-right w3-text-theme"></i> ${`${database.user[username].description}`}</p>
         <p><i class="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> ${database.user[username].creation_date}</p>
        <p><i class="fa fa-money fa-fw w3-margin-right w3-text-theme"></i> ${database.user[username].coins}</p>
        </div>
      </div>
      <br>
      
      <!-- Accordion -->
      <div class="w3-card w3-round">
        <div class="w3-white">
          <button onclick="accordion('Demo1')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-circle-o-notch fa-fw w3-margin-right"></i> My Groups</button>
          <div id="Demo1" class="w3-hide w3-container">
            <p>Some text..</p>
          </div>
          <button onclick="accordion('Demo2')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i> My Events</button>
          <div id="Demo2" class="w3-hide w3-container">
            <p>Some other text..</p>
          </div>

        </div>      
      </div>
      <br>
      
      <!-- Interests --> 
      <div class="w3-card w3-round w3-white w3-hide-small">
        <div class="w3-container">
          <p>Interests</p>
          <p>
          </p>
        </div>
      </div>
      <br>
      
      <!-- Alert Box -->
      <div class="w3-container w3-display-container w3-round w3-theme-l4 w3-border w3-theme-border w3-margin-bottom w3-hide-small">
        <span onclick="this.parentElement.style.display='none'" class="w3-button w3-theme-l3 w3-display-topright">
          <i class="fa fa-remove"></i>
        </span>
        <p><strong>Hello!</strong></p>
        <p>This is a notification box which currently has no use :p</p>
      </div>
    
    <!-- End Left Column -->
    </div>
    
    <!-- Middle Column -->
    <div class="w3-col m7">
    
      <div class="w3-row-padding">
        <div class="w3-col m12">
          <div class="w3-card w3-round w3-white">
            <div class="w3-container w3-padding">
              <h6 class="w3-opacity">Top text</h6>
              <p contenteditable="true" class="w3-border w3-padding">Useless input bar</p>
              <button type="button" class="w3-button w3-theme"><i class="fa fa-pencil"></i>  Button</button> 
            </div>
          </div>
        </div>
      </div>

        <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
        <img src="https://images.vexels.com/media/users/3/163191/isolated/lists/3404f798db8118b2a5bd33cab9c1455c-leather-stitch-badge.png" alt="Badge Card" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <h4>User Badges</h4><br>
        <p>Badges: ${badge_list}</p>
      </div> 

    ${posts_list}
<!--
      <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
        <img src="" alt="Avatar" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <span class="w3-right w3-opacity">Timestamp (to be coded)</span>
        <h4>Username (add soon)</h4><br>
        <hr class="w3-clear">
        <p></p>
      </div>-->

    <!-- End Middle Column -->
    </div>
    
    <!-- Right Column -->
    <div class="w3-col m2">

      <br>
      
      <div class="w3-card w3-round w3-white w3-padding-16 w3-center">
        <p>ADS</p></div>
      <br>
      <div class="w3-card w3-round w3-white w3-padding-32 w3-center">
        <p><i class="fa fa-bug w3-xxlarge"></i><br>Report bugs</p>
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
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
    x.previousElementSibling.className += " w3-theme-d1";
  } else { 
    x.className = x.className.replace("w3-show", "");
    x.previousElementSibling.className = 
    x.previousElementSibling.className.replace(" w3-theme-d1", "");
  }
}
// Used to toggle the menu on smaller screens when clicking on the menu button
function openNav() {
  var x = document.getElementById("navDemo");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else { 
    x.className = x.className.replace(" w3-show", "");
  }
}
</script>
</body>
</html> 

`
  
  );
});
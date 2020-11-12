// Setup basic express server
const express = require('express');
const fs = require("fs");
const Canvas = require('canvas');
var cookieParser = require('cookie-parser');
const database_location = __dirname+"/database.json";
const database = JSON.parse(fs.readFileSync(database_location));
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const config = require('../config.json');
const urlencodedParser = bodyParser.urlencoded({ extended: true });

var port = process.env.PORT || 3232;
var hostname = config.url; // replace with the web domain you are currently using Ex. google.com which will then be a variable to added to https:// HOSTNAME then whatever redirect it's supposed to be
var currency = "Coins";
var botname = '⚙️ !v! ittz';
var prefix = '$';

var no_account_message = `🔏 **Whoops!** There is no such user with this name!<br><br>
<button onclick="location.replace('/register')">Register an account.</button>`;
function msg(type,part,url,version){
  var text;
  if (!part){part='ERROR'}
    if (!url){url='u'}
  if (!type){type='include'}
  if (!version){version='button'}
  if (type==='include'){text=`Please make sure to include your ${part}`;} else
  if (type==='no_account'){text=`There is no user with this name.`}else
  if (type==='exists'){text=`A user with this name already exists!`}else
  if (type==='not_logged'){text=`You are not logged in!!`}else
  if (type==='logged_in'){text=`You are already logged in!`}else
  if (type==='logout'){text=`You have logged out!`}else
  if (type==='post_created'){text=`Your Post has been created!`}else
  if (type==='post_exists'){text=`This post already exists!`}else
  if (type==='post_deleted'){text=`Your post has been deleted!`}else
  if (type==='edited'){text=`Your account has been edited!`}else
  if (type==='incorrect'){text=`Incorrect Password given.`}else
    {text=`Invalid/Empty Input '${part}'`}
  //return `Invalid/Empty Input '${part}'<br><button onclick=location.replace('https://'+window.location.hostname+'/${url}')>Back</button>`;
  
  if (version==='button'){return `${text}<br><button onclick=location.replace('https://'+window.location.hostname+'/${url}')>Back</button>`}else
  if (version==='redirect'){return `<meta http-equiv="Refresh" content="0; url='/${url}?notification=${part}'"/>`}else
  return `<meta http-equiv="Refresh" content="0; url='/${url}?notification=${part}'"/>`
  }

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
  //console.log(process.env)
console.log(`Time: ${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`);
});

function save_database(){
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  console.log(`Saving Database on bot server!`)
}
setInterval(save_database, 240000);

// Routing
app.use(cookieParser());
app.use(express.static(__dirname + '/../app'));
app.set('view engine','ejs');
// Chat room

app.get("/data", (request, response) => {response.render('database', {qs: request.query});});

app.post("/result", urlencodedParser, (request, response) => {
  console.log(request.body)
  if ((request.body.sentpass).toLowerCase()==database.passcode){
    response.send(JSON.stringify(database, null, 2))
  }
  else {response.send("<br>Password sent: "+(request.body.sentpass).toLowerCase()+"<br>Status: Failed")}
});


app.get("/user", (request, response) => {response.render('user', {qs: request.query});});
app.get("/dashboard", (request, response) => {response.render('dashboard', {qs: request.query});});


app.post("/dashboard-edit-account", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.sentname.toLowerCase())) {
    return response.send(msg('no_account','Username','dashboard'));
  }
  var text_add='';
if (database.user[request.body.sentname.toLowerCase()].password===request.body.sentpass){
  if(request.body.sentnewpass){database.user[(request.body.sentname)].password=request.body.sentnewpass;text_add+=`New Password: ${request.body.sentnewpass}`}
  if(request.body.sentnewdesc){database.user[(request.body.sentname)].description=request.body.sentnewdesc;}
  if(request.body.sentnewavatar){database.user[(request.body.sentname)].avatar=request.body.sentnewavatar;}
  //console.log(`${request.body.sentnewdesc.toLowerCase()}:${request.body.sentnewpass.toLowerCase()}:${request.body.sentnewavatar.toLowerCase()}`)
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(msg('edited','Username','u'));
  
}else if (database.user[request.body.sentname.toLowerCase()].password!==request.body.sentpass){
  return response.send(msg('incorrect','Username','dashboard'));
}
});

app.get("/new-post", urlencodedParser, (request, response) => {
  if(!request.query.sentname){return response.send(msg('include','Username','u'));}
  if(!request.query.sentpass){return response.send(msg('include','Password','u'));}
  if(!request.query.sentpost){return response.send(msg('include','Password','u'));}
  if (!database.profiles.includes(request.query.sentname.toLowerCase())) {
    return response.send(msg('no_account','Username and Password','u'));
  }
if (database.user[request.query.sentname.toLowerCase()].password===request.query.sentpass){
if(database.posts[request.query.sentname.toLowerCase()]){
  if(database.posts[request.query.sentname.toLowerCase()].includes((request.query.sentpost).toLowerCase())){return response.send('**Please do not repost!**<button onclick="location.replace(`https://`+window.location.hostname+`/dasboard`)">Back to dashboard</button>');}
  }
  if (!database.posts[request.query.sentname.toLowerCase()]){database.posts[request.query.sentname.toLowerCase()]=[]}
  database.posts[request.query.sentname.toLowerCase()].push((request.query.sentpost).toLowerCase());
    database.user[(request.query.sentname).toLowerCase()].coins+=1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(msg('post_created','Username',`u?username=${request.query.sentname.toLowerCase()}#${database.posts[request.query.sentname.toLowerCase()].length-1}`,'redirect'))
  } else {
    return response.send('**Please do not repost!**<button onclick="location.replace(`https://`+window.location.hostname+`/dasboard`)">Back to dashboard</button>');
  }

});

app.get("/follow", urlencodedParser, (request, response) => {
  if(request.cookies['saved-username']==undefined||!request.cookies['saved-username']){return response.send(msg('include','Username','u'));}
  if(!request.cookies['saved-password']){return response.send(msg('include','Password','u'));}
  if(!request.query.sentfollow){return response.send(msg('include','Password','u'));}
  if (!database.profiles.includes(request.cookies['saved-username'].toLowerCase())) {
    return response.send(msg('no_account','Password','u'));
  }
  if (!database.profiles.includes(request.query.sentfollow.toLowerCase())) {
    return response.send(msg('no_account','Password','u'));
  }
if (database.user[request.cookies['saved-username'].toLowerCase()].password===request.query.sentpass||database.user[request.cookies['saved-username'].toLowerCase()].password===request.cookies['saved-password']){
  if(!database.user[request.cookies['saved-username'].toLowerCase()].following.includes(request.query.sentfollow.toLowerCase())){
  database.user[request.cookies['saved-username']].following.push(request.query.sentfollow.toLowerCase());
  database.user[request.query.sentfollow.toLowerCase()].followers.push(request.cookies['saved-username']);
  //database.user[(request.query.sentname).toLowerCase()].coins+=0.1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Followed!'"/>`);
  } else {
    database.user[request.cookies['saved-username']].following=database.user[request.cookies['saved-username']].following.filter(item => item !== request.query.sentfollow.toLowerCase());
    database.user[request.query.sentfollow.toLowerCase()].followers=database.user[request.query.sentfollow.toLowerCase()].followers.filter(item => item !==request.cookies['saved-username']);
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Unfollowed!'"/>`);
  }
}else if (database.user[request.cookies['saved-username'].toLowerCase()].password!==request.query.sentpass||database.user[request.cookies['saved-username'].toLowerCase()].password!==request.cookies['saved-password']){
  return response.send(`🔏 **Whoops!** Incorrect Password!<br><br><button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">Please try again.</button>`);
}
});

app.post("/delete-post", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.sentname.toLowerCase())) {return response.send(no_account_message+`<button onclick="location.replace('/dashboard')">Try again with a different user</button>`);}
if (database.user[request.body.sentname.toLowerCase()].password===request.body.sentpass){
  delete database.posts[request.body.sentname.toLowerCase()][request.body.sentnum];
  database.user[(request.body.sentname).toLowerCase()].coins-=1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`Ready for the next post?<br><br><button onclick="location.replace('https://'+window.location.hostname+'/dashboard')">New Post</button>`);
}else if (database.user[request.body.sentname.toLowerCase()].password!==request.body.sentpass){
  return response.send(msg('incorrect','Password','dashboard'));
}
});

app.post("/login", urlencodedParser, (request, response) => {
  if (!request.body.sentname||!request.body.sentpass){return response.send(msg('include','Username and Password','u'))}
  if (!database.profiles.includes(request.body.sentname.toLowerCase())) {return response.send(msg('no_account','','u'));}
if (database.user[request.body.sentname.toLowerCase()].password===request.body.sentpass){
if(request.cookies['saved-username']&&request.cookies['saved-password']){
return response.send(msg('logged_in','','u'));
}else{
  
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 900000});
  response.cookie('saved-password', request.body.sentpass, { maxAge: 900000});
  return response.send(msg('logged_in','','u','redirect'));
  }
  
}else if (database.user[request.body.sentname.toLowerCase()].password!==request.body.sentpass){
  return response.send(msg('incorrect','Password','u'));
}
});

app.post("/logout", urlencodedParser, (request, response) => {
if(!request.cookies['saved-username']&&!request.cookies['saved-password']){
return response.send(msg('logged_not','','u','redirect'));
}else{
  response.cookie('saved-username', request.cookies['saved-username'],{maxAge: 0});
  response.cookie('saved-password', request.cookies['saved-password'],{maxAge: 0});
  return response.send(msg('logout','','u','redirect'));
  } 

});

app.post("/user-text", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username.toLowerCase())) {
    return response.send(msg('no_account','','user'));
  }
response.send(`Username: ${request.body.username.toLowerCase()} <br> Description: ${database.user[request.body.username.toLowerCase()].description} <br> ${currency}: ${database.user[request.body.sentname.toLowerCase()].coins} <br> Creation Date: ${database.user[request.body.username.toLowerCase()].creation_date}`);
});

app.get("/register", (request, response) => {response.render('register', {qs: request.query});});
  
app.post("/register-status", urlencodedParser, (request, response) => {
  //console.log(request.body);
  if (database.profiles.includes(request.body.sentname)) {return response.send(msg('exists','d','u'));}
  if (request.body.sentname==null||request.body.sentname==undefined||!request.body.sentname){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentpass==null||request.body.sentpass==undefined||!request.body.sentpass){return response.send(msg('invalid','Password','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (request.body.sentpass!==request.body.sentpassconfirm){return response.send(msg('match','password & confirm password','register'));}
  if (!database.profiles.includes(request.body.sentname)) {
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 900000});
  response.cookie('saved-password', request.body.sentpass, { maxAge: 900000});
  database.profiles.push((request.body.sentname).toLowerCase());
  database.user[(request.body.sentname).toLowerCase()]=
    {password:request.body.sentpass, coins:50, preferred:request.body.sentname,
     background:"https://convertingcolors.com/plain-2C2F33.svg", description:(request.body.sentdesc).toLowerCase(), 
     color:"#000000", avatar:"https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png",
     following:[],followers:[],
     creation_date:`${(time.getMonth()+1)}/${(time.getDate())}/${(time.getFullYear())} ${time.getHours()-4}:${time.getMinutes()}:${time.getSeconds()} ${am_pm}`
    }
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
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
  

app.get("/u", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var username = request.query.username;
  if (!username){if (request.cookies['saved-username']){username=request.cookies['saved-username']}else username='null'}
  if (!database.profiles.includes(username)||!username) {return response.send(no_account_message+`<button onclick="location.replace('/user')">Find a different user.</button>`);}
  var post_number, post_list = "";
  var badge_number, badge_list = "";
  var follow_number, follow_list = "";
  var status = "";var post_bar = "";var profile_menu = "";var side_bar="";
  var self_avatar="https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg";
  var self_link="/register";

  var nav = `<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="w3-border w3-padding" style="width:20vw;" placeholder="Find User"></input>
              <button type="submit" class="w3-button w3-theme"><i class="fa fa-search"></i> Search</button></form>`;
  var scripts = "";
  
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(request.cookies['saved-username']!==undefined){
    self_avatar=database.user[request.cookies['saved-username']].avatar;
    self_link=`/u?username=${request.cookies['saved-username']}`;
    status=`Logged in as: ${request.cookies['saved-username'].toUpperCase()}`;
    profile_menu=` <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px;right:0;top:51px;">
      <form method="POST" action="/logout">
<button type="submit" class="w3-bar-item w3-button">Logout</button>
</form>
      <a href="#" class="w3-bar-item w3-button">Item-2</a>
      <a href="#" class="w3-bar-item w3-button">Item-3</a>
    </div> `
  }else{
    status='not logged in';
    profile_menu = ` <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px;right:0;top:51px;">
      <a href="../register" class="w3-bar-item w3-button">Register</a>
      <a href="#" class="w3-bar-item w3-button">Item-3</a>
    </div> `
    side_bar += `
<div class="w3-card w3-round w3-white w3-padding-16 w3-center">
        <p>LOGIN</p>
<form method="POST" action="/login">
<input type="text" name="sentname" class="w3-border w3-padding" style="width:200px;" placeholder="Username">
<input type="text" name="sentpass" class="w3-border w3-padding" style="width:200px;" placeholder="Password">
              <button type="submit" class="w3-button w3-theme"><!--<i class="fa fa-search"></i>--> Login</button></form>
  </div><br>`
    side_bar += `
<div class="w3-card w3-round w3-white w3-padding-16 w3-center">
        <p>REGISTER</p>
<form method="POST" action="/register-status">
<input type="text" name="sentname" class="w3-border w3-padding" style="width:200px;" placeholder="Username" required>
<input type="text" name="sentdesc" class="w3-border w3-padding" style="width:200px;" placeholder="Description"required>
<input type="password" name="sentpass" class="w3-border w3-padding" style="width:200px;" placeholder="Password" required>
<input type="password" name="sentpassconfirm" class="w3-border w3-padding" style="width:200px;" placeholder="Password (Confirm)" required>
<button type="submit" class="w3-button w3-theme"><!--<i class="fa fa-search"></i>--> Sign Up</button>
</form>
  </div><br>
`
  };
  
  
  if(request.cookies['saved-username']!==undefined&&request.cookies['saved-username']!==username&&username!=='guest'){
  if (database.user[request.cookies['saved-username']].following.includes(username)){nav += `<a href="/follow?sentfollow=${username}" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Follow"><i class="fa fa-heartbeat"></i></a>`}else{
  nav += `<a href="/follow?sentfollow=${username}" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white" title="Follow"><i class="fa fa-heart"></i></a>`}
  }
  

  
  
  
  if(request.cookies['saved-username']!==undefined&&request.cookies['saved-username']==username){
    if (database.user[username].password===request.cookies['saved-password']){
    post_bar = `<form method="get" action="/new-post">
<div class="w3-row-padding w3-hide-small">
        <div class="w3-col m12">
          <div class="w3-card w3-round w3-white">
            <div class="w3-container w3-padding">
              <h6 class="w3-opacity">New Post</h6>
              <input type="hidden" name="sentname" value="${request.cookies['saved-username']}">
              <input type="hidden" name="sentpass" value="${request.cookies['saved-password']}">
              <input type="text" name="sentpost" class="w3-border w3-padding" placeholder="Post Input"></input>
              <button type="submit" class="w3-button w3-theme"><i class="fa fa-pencil"></i> Send</button>
            </div>
          </div>
        </div>
      </div>
</form>
`}
  }
  
    if(database.badges.creator.includes(username)){badge_list += "Creator";}
    if(database.badges.developer.includes(username)){if(database.badges.creator.includes(username)){badge_list += ", "};badge_list += "Developer";}
    if(database.badges.moderator.includes(username)){if(database.badges.developer.includes(username)){badge_list += ", "};badge_list += "Moderator";}
    if(database.badges.early_member.includes(username)){if(database.badges.moderator.includes(username)){badge_list += ", "};badge_list += "Early Member";}
    if(database.badges.long_user.includes(username)){if(database.badges.early_member.includes(username)){badge_list += ", "};badge_list += "Long Time User";}
    if(database.badges.testing.includes(username)){if(database.badges.long_user.includes(username)){badge_list += ", "};badge_list += "Testing";}
  
    if(typeof database.posts[username] !== "undefined"){
    
  for (post_number in database.posts[username]) {
    post_list +=  `<div class="w3-container w3-card w3-white w3-round w3-margin" id="post-${[post_number]}"><br>
        <img src="${`${database.user[username].avatar}`}" alt="User_Avatar" class="w3-circle" style="width:60px">
        <span class="w3-right w3-opacity">#${post_number}</span>
        <h4>${database.user[username].preferred}</h4><br>
        <hr class="w3-clear">
        <p>${database.posts[username][post_number]}</p>
      </div>` ;
  }}
  
  var follow_amount = database.user[username].followers.length;
  if(typeof database.user[username].following !== "undefined"){
    if(database.user[username].following.length-1 < 0){follow_list="No One"}
  for (follow_number in database.user[username].following) {
    follow_list +=  `<a href='https://${hostname}/u?username=${database.user[username].following[follow_number]}'>${database.user[username].following[follow_number]}</a>`
    if (database.user[username].following.length-1 > follow_number){
    if(database.user[username].following.length-1 > 0){follow_list += `, `};
    }
  }}
  
response.send(
    `<!DOCTYPE html>
<script>
${scripts}
/*var nameval = '';
if('${request.cookies['saved-username']}'!=='undefined'){nameval='Username: ${request.cookies['saved-username']}'}else{nameval='not logged in'};
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
<style>
#popup {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
}

#popup.show {
  visibility: visible;
  -webkit-animation: fadein_popup 0.5s;
  animation: fadein_popup 0.5s;
}</style>

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
<a class="w3-hide-small">${nav}</a>
  <div class="w3-dropdown-hover w3-hide-small">

    <button class="w3-button w3-padding-large" title="Notifications"><i class="fa fa-bell"></i><span class="w3-badge w3-right w3-small w3-green">3</span></button>     
    <div class="w3-dropdown-content w3-card-4 w3-bar-block" style="width:300px;">
      <a href="#" class="w3-bar-item w3-button">Item-1</a>
      <a href="#" class="w3-bar-item w3-button">Item-2</a>
      <a href="#" class="w3-bar-item w3-button">Item-3</a>
    </div>
  </div>
  <div onclick=location.replace('https://'+window.location.hostname+'${self_link}') class="w3-bar-item w3-button w3-hide-small w3-right w3-padding-large w3-hover-white w3-dropdown-hover" title="My Account">
${profile_menu}
    <img src="${self_avatar}" class="w3-circle" style="height:23px;width:23px" alt="Avatar">

  </div>
 </div>
</div>

<!-- Navbar on small screens -->
<div id="navDemo" class="w3-bar-block w3-theme-d2 w3-hide w3-hide-large w3-hide-medium w3-large">
  <a href="javascript:void(0);" class="w3-bar-item w3-button w3-padding-large">Hidden</a>
  <a>${nav}</a>
  <a href="../" class="w3-bar-item w3-button w3-padding-large">Chat Room</a>
  <a href="../dashboard" class="w3-bar-item w3-button w3-padding-large">Dashboard</a>
  <a href="${self_link}" class="w3-bar-item w3-button w3-padding-large">${status}</a>
</div>

<!-- Page Container -->
<div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">    
  <!-- The Grid -->
  <div class="w3-row">
    <!-- Left Column -->
    <div class="w3-col m3">
      <!-- Profile -->
      <!--<div class="w3-card w3-round w3-white">-->
      <div class="w3-card w3-round" style="background-image: url('${database.user[username].banner}');background-color:white;">
        <div class="w3-container">
         <h4 class="w3-center" style="color:${database.user[username].color}">${database.user[username].preferred} </h4>
         <p class="w3-center"><img src="${`${database.user[username].avatar}`}" class="w3-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         <p><i class="fa fa-user fa-fw w3-margin-right w3-text-theme"></i> ${`${username}`}</p>
         <p><i class="fa fa-comment fa-fw w3-margin-right w3-text-theme"></i> ${`${database.user[username].description}`}</p>
         <p><i class="fa fa-birthday-cake fa-fw w3-margin-right w3-text-theme"></i> ${database.user[username].creation_date}</p>
        <p><i class="fa fa-money fa-fw w3-margin-right w3-text-theme"></i> ${currency}: ${database.user[username].coins}</p>
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
          <button onclick="accordion('Demo2')" class="w3-button w3-block w3-theme-l1 w3-left-align"><i class="fa fa-calendar-check-o fa-fw w3-margin-right"></i> Follows</button>
          <div id="Demo2" class="w3-hide w3-container">
            <p>Followers: ${follow_amount}</p>
            <p>Following: ${follow_list}</p>
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
    ${post_bar}
    <!--
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
      </div>-->

        <div class="w3-container w3-card w3-white w3-round w3-margin"><br>
        <img src="https://images.vexels.com/media/users/3/163191/isolated/lists/3404f798db8118b2a5bd33cab9c1455c-leather-stitch-badge.png" alt="Badge Card" class="w3-left w3-circle w3-margin-right" style="width:60px">
        <h4>User Badges</h4><br>
        <p>Badges: ${badge_list}</p>
      </div> 

    ${post_list}
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
${side_bar}


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

 <!--<footer class="w3-container w3-theme-d5">
  <p>Designed by <a href="https://www.w3schools.com/w3css/default.asp" target="_blank">w3.css</a></p>
</footer>-->

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
<div id="assets"></div><!--Loads the extra files that aren't written in the document.-->
`
  );
});
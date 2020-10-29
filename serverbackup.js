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
    //response.send("<br>Password sent: "+(request.body.sentpass).toLowerCase()+"<br>Real Password: "+database.passcode+"<br>Status: Sucess")
  }
  
  else {response.send("<br>Password sent: "+(request.body.sentpass).toLowerCase()+"<br>Status: Failed")}
});


app.get("/user", (request, response) => {response.render('user', {qs: request.query});});

app.post("/user", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username)) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }
  
  var bg_image = 'https://convertingcolors.com/plain-2C2F33.svg';
  const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(bg_image).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(`${database.avatar[request.body.username.toLowerCase()]}`).then((pfp) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                  Canvas.loadImage('https://cdn.discordapp.com/attachments/660390332772646922/744094457317818388/discordowner.svg').then((owner) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                     ctx.drawImage(xp, 225, 130, 50, 50);//xp,225,90,50,50
                     ctx.drawImage(lb, 40, 205, 30, 30);
                     if (request.body.username.toLowerCase()==='orago') {ctx.drawImage(owner, 185, 50, 55, 40)}
                     ctx.font = '40px sans-serif';
                     ctx.fillStyle = '#FFFFFF'
                     ctx.fillText(`${request.body.username.toLowerCase()}`, 240, 90);
                     ctx.font = '25px sans-serif';
                     ctx.fillText(`${database.coins[request.body.username.toLowerCase()]} ${currency}`, 270, 170);
                     ctx.fillText(`Bio: ${database.description[request.body.username.toLowerCase()]}`, 77, 229);
                     ctx.strokeStyle = '#74037b';
	                   ctx.strokeRect(0, 0, canvas.width, canvas.height);
	                   ctx.beginPath();
	                   ctx.arc(105, 120, 75, 0, Math.PI * 2, true);
	                   ctx.closePath();
	                   ctx.clip();
                     ctx.drawImage(pfp, 30, 45, 150, 150);
                     response.send('<img src="' + canvas.toDataURL() + '" />');
                   })
                 })
               })
             })
       })
       })
});

app.post("/user-vaporwave", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username)) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }
  
  const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
   Canvas.loadImage('https://img.freepik.com/free-vector/retro-vaporwave-background-cyberpunk-laser-grid-80s-style-abstract-futuristic-landscape_87408-125.jpg').then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(`${database.avatar[request.body.username.toLowerCase()]}`).then((icon) => {
Canvas.loadImage('https://cdn.discordapp.com/attachments/741450918020513813/742241361968758804/boxie32bfull.png').then((boxie) => {
                     ctx.drawImage(boxie, 642, 192, 48, 48);
                     ctx.font = '40px sans-serif';
                     if (request.body.username.toLowerCase()==='orago'){ctx.fillStyle = "#deff1a";}
                     else {ctx.fillStyle = "#ffffff";}
                     ctx.fillText(`${request.body.username.toLowerCase()}`, 240, 90);
                     ctx.fillStyle = "#ffffff";
                     ctx.font = '25px sans-serif';
                     ctx.fillText(`ID: ${`To-Do`}`, 240, 150);
                     ctx.strokeStyle = '#74037b';
	                   ctx.strokeRect(0, 0, canvas.width, canvas.height);
	                   ctx.beginPath();
	                   ctx.arc(100, 125, 75, 0, Math.PI * 2, true);
	                   ctx.closePath();
	                   ctx.clip();
                     ctx.drawImage(icon, 25, 25, 150, 150);
                     response.send('<img src="' + canvas.toDataURL() + '" />');
              })
             })
           })
});
app.post("/user-text", urlencodedParser, (request, response) => {
  if (!database.profiles.includes(request.body.username)) {
    return response.send('🔏 **Whoops!** There is no such user with this name!'
                        +'<br><br><button onclick="location.replace(window.location.hostname+`/register`)">Register an account.</button>');
  }
response.send(
    `Username: ${request.body.username.toLowerCase()} <br> Description: ${database.description[request.body.username.toLowerCase()]} <br> ${currency}: ${database.coins[request.body.username.toLowerCase()]} `
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
  database.profiles.push((request.body.sentname).toLowerCase());
  database.user[(request.body.username).toLowerCase()]=(request.body.sentpass).toLowerCase();
  database.coins[(request.body.username).toLowerCase()]=0;
  database.background[(request.body.username).toLowerCase()] = "https://convertingcolors.com/plain-2C2F33.svg";
  database.description[(request.body.username).toLowerCase()] = (request.body.sentdesc).toLowerCase();
  database.color[(request.body.username).toLowerCase()] = "#ffffff";
  database.avatar[(request.body.username).toLowerCase()] = "cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
  database.badges[(request.body.username).toLowerCase()]=[];                                                           
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  console.log(`Account created, Username: ${(request.body.username).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
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
  database.user[socket.username.toLowerCase()]=data.toLowerCase();
  database.coins[socket.username.toLowerCase()]=0;
  database.background[socket.username.toLowerCase()] = "https://convertingcolors.com/plain-2C2F33.svg";
  database.description[socket.username.toLowerCase()] = 'No Description Set';
  database.color[socket.username.toLowerCase()] = "#ffffff";
  database.avatar[socket.username.toLowerCase()] = "cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
  database.badges[socket.username.toLowerCase()]=[];
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
  database.last_daily[socket.username.toLowerCase()]=data;
  database.coins[socket.username.toLowerCase()]+=50;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  });
  
  socket.on('claim mine', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: socket.username+` has just collected a daily reward by using ${prefix}daily!`//data
    });
    console.log("Coin mined")
  database.coins[socket.username.toLowerCase()]+=data;
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
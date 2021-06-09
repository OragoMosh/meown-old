// Created by Orago>
// Based on Socket.io
var botname = '⚙️MEOWN' //The username of the bot
var prefix = '$' //The symbol used to call a command
var cmdlist = ''+prefix+'join, '+prefix+'help, '+prefix+'refresh, '+prefix+'reload, '+prefix+'info, '+prefix+'time '+prefix+'fun, '//simple list of the commands that are easier to reach
var ver = '1.04'//The version of the command used
var pname = "Meown Chat"
var url = "https://meown.glitch.me"


function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function splash_title(text,length){
  if (!text){text="This should be fixed!"}
  if (!length){length=3500;}
  var title = document.title;
  document.title = text;
  setTimeout(function(){ document.title = title}, length);
}
  var FADE_TIME = 150; // ms
  var TYPING_TIMER_LENGTH = 400; // ms
  var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#008dff', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
    '#CC9014', '#FF6C00', '#7900ff', '#14CC78',
    '#001bff', '#00b2d8', '#7900ff', '#00d877',
    '#4d7298', '#795da3', '#f47577', '#db324d',
    '#EE4035', '#F3A530', '#56B949', '#30499B',
    '#F3A530', '#56B949', '#844D9E', '#4e1c81'
  ];
var time = new Date();
          var month = new Array();
  month[0] = "January";
  month[1] = "February";
  month[2] = "March";
  month[3] = "April";
  month[4] = "May";
  month[5] = "June";
  month[6] = "July";
  month[7] = "August";
  month[8] = "September";
  month[9] = "October";
  month[10] = "November";
  month[11] = "December";
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  
  // Initialize variables
  var $window = $(window);
  var message = {
  "object": document.getElementsByClassName("message-object"),
  "div":document.getElementById("messages"),
  "input":document.getElementById("input")
  }
  //var inputMessage = document.getElementById("input"); // Input message input box

  var usernameInput = document.getElementById("usernameInput"); // Input for usernamevar usernameInput = document.getElementById("usernameInput");
  var roomList = document.querySelector(".room-list"); // Room list <ul>
  var $btnTips = $('.btn-tips'); // Tool buttons
  
  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var currentInput = usernameInput;
  var $roomDiv;
  var roomNameRule = /^(?!\s*$)[a-zA-Z0-9_\u4e00-\u9fa5 \f\n\r\t\v]{1,14}$/;

  var socket = io();

  function addParticipantsMessage (data) {
    var message_alt;
    if (!data.userJoinOrLeftRoom) {
      if (data.numUsers === 1) {
        message_alt = 'You are alone now!';
      } else {
        message_alt = 'There are ' + data.numUsers + ' users in ' + pname;
      }
    }
    log(message_alt);
  }
var cookieName = getCookie("saved-username")
if (cookieName){
setUsername (cookieName);
}else{
  location.replace("/login")
}
  // Sets the client's username
  function setUsername (given_name) {
    // If user name is input, get and then emit 'add user' event.
    // trim(): remove the whitespace from the beginning and end of a string.
    username = cleanInput(given_name);

    // If the username is valid
    if (username) {
      //loginPage.style.display='none';
      //if (document.getElementById("popup")){openForm()}
      //$chatPage.show();
      //$roomPage.fadeIn();
      //loginPage.off('click');
      currentInput = message.input;

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  // Sends a chat message.
  function sendMessage () {
    var message_alt = message.input.value;
    // Prevent markup from being injected into the message
    message_alt = cleanInput(message_alt);
    // if there is a non-empty message and a socket connection
    if (connected) {
      message.input.value='';
      if (message_alt.charAt(0) !== prefix) {
        addChatMessage({
          username: username,
          message: message_alt
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message_alt);
        // If input a command with '/'.
      } else {
        inputCommand(message_alt);
      }
    }
  }

  // Sends a command.
  function inputCommand (message) {
    var words = message.split(' ');
    var cmd = words[0].substring(1, words[0].length).toLowerCase();
    //delete input[0]
    switch (cmd) {
        
      //Tool Commands
      case 'join':// Command /join [room name] = join room.
        words.shift();
        var room = words.join(' ');
        if (roomNameRule.test(room)) {
          socket.emit('join room', room);
          //noinspection JSUnresolvedVariable
          roomList.scrollTop = roomList.scrollHeight;
        } else {
          log('Length of room name is limited to 1 to 14 characters, ' +
              'and can only be composed by the Chinese, ' +
            'English alphabet, digital and bottom line', {})
        }
        break;
        
      case 'dm': 
        if (username == words[1])
          return log("You can't start a dm with yourself!")
        socket.emit('join dm',{from:username,to:words[1]});
        break;
        
      case 'help': // Command /help lists all commands
        message = 'Help list: '+prefix+'help1, '+prefix+'help2, '+prefix+'help3 ';
        log(message);
        break;
        
      case 'help1': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 1 Useful Commands -_-');
        log(prefix+'help - Shows a list of helping commands'); log(prefix+'fun - shows a list of fun commands'); log(prefix+'ree - Basically just says ree with audio (turn ur volume up)');
        log(prefix+'commands - Shows a list of useable commands'); log(prefix+'updates - shows a list of new updates'); log(prefix+'refresh - This command refreshes the room list if new ones arent loading');
        log('-- use '+prefix+'help2 for more info --');
        log('--------------------');
        break;
        
      case 'help2': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 2 Useful Commands -_-');
        log(prefix+'info - Shows server version and creator info'); log(prefix+'time - Shows the current time'); log(prefix+'reload - This command will reload the server page');
        log(''); log(''); log('');
        log('-- use '+prefix+'help3 for more info --');
        log('--------------------');
        break;
        
        case '': // Command /help lists all commands
        log('Please type `'+prefix+'help` for more info.');
        break;
        
        case 'login': // Command /help lists all commands
        log('<div class="g-signin2" data-onsuccess="onSignIn"></div>');
        break;
        
      case 'updates': // Command /help lists all commands
        log('--------------------');
        log('-- Updates List --');
        log('-_- Useful Commands -_-'); log('- Added a month and day for '+prefix+'time'); log('- Added a '+prefix+'update function');
        log('-- use '+prefix+'help2 for more info --');
        log('--------------------');
        break;
        
      case 'commands': // Command /help lists all commands
        message = 'Commands: '+cmdlist+prefix+'help';
        log(message);
        break;
        
      case 'refresh':// Command /refresh = reload room list.
        socket.emit('room list');
        break;
        
      case 'info':// Command /info = Server info
        message = 'This server is running V'+ver;
        log(message);
        break;
        
      case 'pm': 
        function rest_of(value,index){
          var x="";
          for (var i = index; i < value.length; i++) {
            x += value[i]+" "
        }
          return x;
        }
        socket.emit('private message',{from:username,to:words[1],message:rest_of(words,2)});
        break;
        
      case 'time': // Command /time shows the current time
        message = 'The time is '+month[time.getMonth()]+', '+weekday[time.getDay()]+' '+time.getHours()+':'+time.getMinutes();
        log(message);
        break;
        
      case 'reload': // Command /reload will reload the website page
        window.location.reload(true);
        message = 'Reloading will now commence...'
        log(message);
        break;
        
      default:
        message = 'You have entered an invalid command';
        log(message);
        break;
        
    }
  }

  // Log a message
  function log (message, options) {
 addChatMessage({message:message},{color:"grey"})
  }

  // Adds the visual chat message to the message list
  function addChatMessage2 (data, options) {
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var userName = data.username;
    var colorOfUserName = getUsernameColor(userName);
    if (data.typing !== true) {
      userName += ': ';
    }
    if (data.message !== ''){
      var usernameDiv = document.getElementsByClassName("username");var i;for (i = 0; i < Object.keys(usernameDiv).length; i++) {usernameDiv.innerText = userName;usernameDiv.style.color = colorOfUserName}
      var messageBodyDiv = document.getElementsByClassName("messageBody");var i;for (i = 0; i < Object.keys(messageBodyDiv).length; i++) {messageBodyDiv.innerText = data.message;}
      
      var typingClass = data.typing ? 'typing' : '';

      var messageDiv = document.getElementsByClassName("message");
      var i;for (i = 0; i < Object.keys(messageDiv).length; i++) {messageDiv.data = data.message;messageDiv.classList.add(typingClass);messageDiv.append(usernameDiv, messageBodyDiv);}
      
      //addMessageElement(messageDiv, options);
    }
  }
function scrollToBottom(element) {
  element.scroll({ top: element.scrollHeight, behavior: 'smooth' });
}
async function getConfig(){
  var result;await fetch(url+"/api/config").then(response => response.json()).then(data => {result = data.response;});return await result;
}

var config = getConfig();

    async function get_role(username,category){
    var user;
    await fetch(url+"/api/user/"+username).then(response => response.json()).then(data => {user = data});
    var def = "#000000";
    var vals = {color:def,symbol:"",name:username}
    if (!user[username]){vals.color = def;}
    if (category === "user"){
    var r;for (r = 0; r < Object.keys(config.role_info).length; r++) {
    if(user[username].roles.includes(Object.keys(config.role_info)[r]))
    {
      if (config.role_info[Object.keys(config.role_info)[r]].color){
        vals.color = config.role_info[Object.keys(config.role_info)[r]].color;
      }
      if (config.role_info[Object.keys(config.role_info)[r]].symbol){
        vals.symbol = config.role_info[Object.keys(config.role_info)[r]].symbol;
        vals.name = `${username} ${config.role_info[Object.keys(config.role_info)[r]].symbol}`;
      }else {vals.name = username};
      r=r+Object.keys(config.role_info).length;
    }
    else
    {
      vals.color = def;
    }
    }
    }else 
    {
      vals.color = def;
    }
      return vals;
    }

async function addChatMessage(data,options){
const newMessage = document.createElement("li");
if (username !== getCookie("saved-username")){location.replace(`/error?text=You shouldn't do that!&value=--${username} is-- ---sus!---`)}
var who = data.username;//if(!who){who="error"}
var msg = data.message;
if (!options){options = {};}
if (data){ 
  if (data.from===username){
    splash_title("Why tho?")
  }
    switch(data.type){
    case 'pm': options.color = "blue";break;
    case 'log': options.color = "grey";break;
    }
  options.type = data.type;
}
//var user_get = await fetch("https://meown-beta.glitch.me/api?method=user&search="+username)
//var user = await user_get.then(response => response.json())
//alert(user.description)
if (!msg){return}
  
if (message.object.length > 25){message.object[0].remove(this)}
  
message.input.value="";message.input.focus();
  
newMessage.setAttribute("class", "message-object");
  
if (who){newMessage.style.color = "black"}
  
if (options){
  if (options.color){newMessage.style.color = options.color}
  if (options.color_values){newMessage.style.color = options.color}
}
        if ( msg.includes("!i") ){ var element = document.createELement("img"); element.setAttribute("style","width:20%;height:20%;");element.setAttribute("src",reSymbol(msg,"!i","i!",``,``)); message.div.append(element);}
      if ( msg.includes("```") ){ var element = document.createELement("div"); element.setAttribute("class","simple-container simple-card simple-round simple-margin simple-theme-border");element.setAttribute("src",reSymbol(msg,"```","```",``,``)); message.div.appendChild(element);}
      if ( msg.includes("@") ){ msg = mention(msg); }
      if ( msg.includes("\\n") ){ msg = msg.replace(/\\n/g,"<br>"); }
      if ( msg.includes("\\b") ){ msg = msg.replace(/\\b/g,"&emsp;"); }
  if (!who){newMessage.innerText = `${msg}`;}else{newMessage.innerText = `${who}: ${msg}`;}
  var scrolling=false;
  if (message.div.scrollHeight-message.div.scrollTop <= message.div.offsetHeight){scrolling=true;}
message.div.appendChild(newMessage);
  if (scrolling){scrollToBottom(message.div)}
}//End of "addMessage(who,message_value){}"
  
  // Adds the visual chat typing message
  function addChatTyping (data) {
    data.typing = true;
    data.message = 'is typing...';
    addChatMessage(data);
  }
  // Removes the visual chat typing message
  function removeChatTyping (data) {
    getTypingMessages(data).fadeOut(function () {
      $(this).remove();
    });
  }

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)


  // Prevents input from having injected markup
  function cleanInput (input) {
    //
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    //return $('<div/>').text(input).text();
    
    //html = html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Updates the typing event
  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function () {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  // Gets the 'X is typing' messages of a user
  function getTypingMessages (data) {
    return $('.typing.message').filter(function () {
      alert(`${$(this)}, ${this}`)
      return $(this).data('username') === data.username;
    });
  }

  // Gets the color of a username.
  function getUsernameColor (username) {
    var eachCharCode = 0;
    var randIndex;
    for (var ii = 0; ii < username.length; ii++) {
      eachCharCode += username.charCodeAt(ii);
    }
    randIndex = Math.abs(eachCharCode % COLORS.length);
    return COLORS[randIndex];
  }

  function countInArray(array, what) {
    var count = 0;
    for (var i = 0; i < array.length; i++)
    	if (array[i] === what) count++;
    return count;
}

  function updateRoomList(users){
    var userElement = document.getElementById("users");
    userElement.innerHTML = "";
    if (countInArray(users, username) > 1){
      setTimeout(function(){ window.location.replace("/?popup=This%20account%20is%20already%20connected!"); }, 500);
    }
    if (userElement){
      users.forEach( (e,i) => {
        userElement.innerHTML+= `<li class="simple-button simple-theme-button" onclick="window.location.replace('/u/${e}');" title="Visit @${e}\'s page!">${i}: ${e}</li> <br>`;
      })
      
    }
  }
  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    //noinspection JSUnresolvedVariable
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  // Focus input when clicking on the message input's border
  message.input.click(function () {
    message.input.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    updateRoomList(data.users);
    connected = true;
    // Display the welcome message
    var message = '— Welcome to ' + pname+ ' —';
    var prefhelp = 'The bot prefix is currently ' + prefix;
    log(prefhelp, {
      prepend: true
    });
    log(message, {
      prepend: true
    });
    
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'new message', update the chat body
  socket.on('new message', function (data) {
    addChatMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    updateRoomList(data.users);
    log(data.username+" "+data.logAction + data.logLocation + data.roomName, {
      userConnEvent: true,
      username: data.username
    });
    addParticipantsMessage(data);
    socket.emit('room list');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    updateRoomList(data.users);
    log(data.username+" "+data.logAction + data.logLocation + data.roomName, {
      userConnEvent: true,
      username: data.username
    });
    addParticipantsMessage(data);
    removeChatTyping(data);
    // Reload room list.
    socket.emit('room list');
  });

  // Whenever the server emits 'typing', show the typing message
  socket.on('typing', function (data) {
    addChatTyping(data);
  });

  // Whenever the server emits 'stop typing', kill the typing message
  socket.on('stop typing', function (data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function () {
    log('You have disconnected...');
    // Reload room list.
    socket.emit('room list');
  });

  socket.on('reconnect', function () {
    log('You have reconnected!');
    if (username) {
      socket.emit('add user', username);
      // Reload room list.
      socket.emit('room list');
    }
  });

  socket.on('reconnect_error', function () {
    log('Reconnect failed...');
  });

  // Show current room list.
  socket.on('show room list', function (room, rooms) {
    roomList.innerHTML = "";
    var roomClassName = room.trim().toLowerCase().replace(/\s/g,'');
    var roomName = Object.keys(rooms)[0];
    var numUserInRoom = rooms[0];
    
    $.each(rooms, function (roomName, numUserInRoom) {
      console.log(`Rooms: ${JSON.stringify(rooms)}-,- Room Name: ${roomName}-,- Number Users: ${numUserInRoom}`)
      // Set class name of room's <div> to be clear.
      if (roomName.startsWith("public-")){
        roomName = roomName.replace("public-","");
      }
      if (roomName.startsWith("dm-")){
        return
      }
      
      var className = roomName.trim().toLowerCase().replace(/\s/g,'');
      var roomDiv = document.createElement("div")
      roomDiv.setAttribute("class","room")
      roomDiv.innerHTML = '<b>' + roomName + '</b>'
          + '<span class="user-number-in-room">'
          + '(' + numUserInRoom + ' users' + ')' + '</span>'
      roomDiv.className += ` ${className}`;
      roomDiv.onclick = function(){
        socket.emit('join room', roomName);
        message.input.focus();
      };
      
      roomList.append(roomDiv);
    });

    $('.' + roomClassName).addClass('joined-room');
  });
  
  socket.on('join left result', function (data) {
    // log results.
    console.log(data.users);
    log(data.username + data.logAction
      + data.logLocation + data.roomName, {});
  });

  // Every 30 secs. reload current room list.
  setInterval(function () {
    socket.emit('room list');
  }, 30000);

  $btnTips.tooltip();
  $btnTips.on( "click", function() {
    $('#effect-tips').toggle('blind');
  });


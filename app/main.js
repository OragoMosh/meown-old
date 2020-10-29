/* Author: Orago <Orago#0051>*/
// Based on Socket.io
var botname = '⚙️ !v! ittz'; //The username of the bot
var cmdlist = prefix+'join, '+prefix+'help, '+prefix+'refresh, '+prefix+'reload, '+prefix+'info, '+prefix+'time '+prefix+'fun, ';//simple list of the commands that are easier to reach
var ver = '1.04';//The version of the command used
var prefix = '$'; //The symbol used to call a command
var pname = "Mittz Chat";
var staff_only = "This option is for staff only.";
var database = "d";
var time_value;
var time;



function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
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
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function existsCookie(type) {
  var cookie_value=getCookie(type);
  if (cookie_value != "") {
    return true;//Exists
  } else {
     if (cookie_value != "" && cookie_value != null) {
       return false;//Does not Exist
       //setCookie(type, value, 30);
     }
  }
}

function valueCookie(type) {
  var cookie_value=getCookie(type);
return cookie_value;
}



  function new_time(){
time_value = new Date
time = time_value.getTime()
}

function testing(){
  if (cat == null){
    var cat = 1
  }
  cat +=1
return cat;
}

$(function() {
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
  var $usernameInput = $('.usernameInput'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var $loginPage = $('.login.page'); // login page
  var $chatPage = $('.chat.page'); // Chat room page
  var $roomPage = $('.room.page'); // Room list page
  var $roomList = $('.room-list'); // Room list <ul>
  var $btnTips = $('.btn-tips'); // Tool buttons

  // Prompt for setting a username
  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput.focus();
  var $roomDiv;
  var roomNameRule = /^(?!\s*$)[a-zA-Z0-9_\u4e00-\u9fa5 \f\n\r\t\v]{1,14}$/;
  
  
  var socket = io();
  
  socket.emit('sync');
socket.on('handshake', function (data) {
database=data;
  });

  function addParticipantsMessage (data) {
    var message;
    if (!data.userJoinOrLeftRoom) {
      if (data.numUsers === 1) {
        message = 'You are alone now!';
      } else {
        message = 'There are ' + data.numUsers + ' users in ' + pname;
      }
    }
    log(message);
  }
  
  // Sets the client's username
  function setUsername () {
    // If user name is input, get and then emit 'add user' event.
    
    username = cleanInput($usernameInput.val().trim());
    

    if(typeof database.profiles == "undefined"){
      setTimeout(setUsername, 500);return console.log('tis')
    }
    if (database.profiles.includes(username.toLowerCase())) {
      if (!existsCookie("logged-in")){//Checks to see if there is a cookie for an account logged in
        if (valueCookie("saved-username")!==username) {//Checks to see if the cookie matches the current account or not.
          var pass_input = prompt("Please input the password for the account @"+username, "");
        }
      }
        if(valueCookie("saved-username")==username&&valueCookie("saved-password")!==null){pass_input=valueCookie("saved-username")}
  if (pass_input == null || pass_input == "") {
    {location.reload();return}
  } else {
if (valueCookie("saved-username")==username&&database.user[username.toLowerCase()].password==valueCookie("saved-password")){}
else if (database.user[username.toLowerCase()].password==pass_input.toLowerCase()){alert("Success!"); 
 if(valueCookie("saved-username")==null||valueCookie("saved-username")!==username){setCookie("saved-username", username, 30);setCookie("saved-password", pass_input, 30);}}
    else{alert("Wrong password!");return location.reload();}
  
  }
  }
    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $roomPage.fadeIn();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }


  // Sends a chat message.
  function sendMessage () {
    var message = $inputMessage.val();
    // Prevent markup from being injected into the message
    message = cleanInput(message);
    // if there is a non-empty message and a socket connection
    if (connected) {
      $inputMessage.val('');
      if (message.charAt(0) !== prefix) {
        addChatMessage({
          username: username,
          message: message
        });
        // tell server to execute 'new message' and send along one parameter
        socket.emit('new message', message);
        // If input a command with '/'.
      } else {
        inputCommand(message);
      }
    }
  }

  // Sends a command.
  function inputCommand (message) {
    var words = message.split(' ');
    var cmd = words[0]
      .substring(1, words[0].length)
      .toLowerCase();

    switch (cmd) {
        
      //Tool Commands
      case 'join':// Command /join [room name] = join room.
        words.shift();
        var room = words.join(' ');
        if (roomNameRule.test(room)) {
          socket.emit('join room', room);
          //noinspection JSUnresolvedVariable
          $roomList[0].scrollTop = $roomList[0].scrollHeight;
        } else {
          log('Length of room name is limited to 1 to 14 characters, ' +
              'and can only be composed by the Chinese, ' +
            'English alphabet, digital and bottom line', {})
        }
        break;
        
      case 'help': // Command /help lists all commands
        message = 'Help list: '+prefix+'help1, '+prefix+'help2, '+prefix+'help3 ';
        log(message);
        break;
        
      case 'help1': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 1 Useful Commands -_-');
        
        log(prefix+'help - Shows a list of helping commands');log(prefix+'updates - shows a list of new updates'); 
        log(prefix+'commands - Shows a list of useable commands'); log(prefix+'refresh - This command refreshes the room list if new ones arent loading');
        log(prefix+'info - Shows server version and creator info'); log(prefix+'time - Shows the current time'); 
        log('/reload - This command will reload the server page');
        
        log('-- use /help2 for more info --');
        log('--------------------');
        break;
        
      case 'help2': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 2 Useful Commands -_-');
         
        
        log('-- use '+prefix+'help3 for more info --');
        log('--------------------');
        break;
        
      case 'help3': // Command /help lists all commands
        log('--------------------');
        log('-- Help List --');
        log('-_- Page - 3 Fun Commands -_-');

        log('EMPTY')
        
        
        log('-- use '+prefix+'help for more info --');
        log('--------------------');
        break;
        
      case 'logs': // Command /help lists all commands

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
        
      case 'time': // Command /time shows the current time
        message = 'The time is '+month[time.getMonth()]+', '+weekday[time.getDay()]+' '+time.getHours()+':'+time.getMinutes();
        log(message);
        break;
        
      case 'reload': // Command /reload will reload the website page
        window.location.reload(true);
        message = 'Reloading will now commence...'
        log(message);
        break;    


        
        case 'register':
      words.shift();
        //log(database.profiles.includes(username.toLowerCase()))
        if (database.profiles.includes(username.toLowerCase())){return log("You are already logged in!")}
      var password = words.join(' ');
      if (password){
        var txt;
      var r = confirm("Are you sure you want the password \""+password+"\"");
      if (r == true) {
        log("Your password is now \""+password+"\", @"+username+" Please write this somewhere so it doesn't get forgotten, currently we do not have the service to reset passwords!");
        socket.emit('create account', password);
        socket.emit('sync');
        //setTimeout(function(){ window.location.reload(); }, 15000);
      } else {
        log("You have canceled")
      }
    }
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'register Password12345')}
        break;
        
        case 'daily':
      words.shift();
        
        time_value = new Date
        if (!database.profiles.includes(username.toLowerCase())){return log("You have not registered yet!")}
        if (time >= parseInt(database.user[username.toLowerCase()].last_daily+86400000)){return log("You need to wait a whole day to do this again!")}
        log(`You have claimed your daily ${50} coins!`);
        socket.emit('claim daily', time);
        socket.emit('sync');
        break;
        
        case 'mine':
        words.shift();
        if (!database.profiles.includes(username.toLowerCase())){return log("You have not registered yet!")}
        log(`You have mined ${0.01} coins and now have ${database.user[username.toLowerCase()].coins+0.01}!`);
        socket.emit('claim mine', 0.01);
        socket.emit('sync');
        break;
        
        case 'search':
      words.shift();
        location.replace('/user');
        break;
        
        case 'database':
      words.shift();
        location.replace('/data');
        break;
        
        
        case 'coins':
        socket.emit('sync');
      words.shift();
        if (!database.profiles.includes(username.toLowerCase())){return log("Please create a user with '"+prefix+"register' !")}
        log("You have "+database.user[username.toLowerCase()].coins+" coins.");
        
        break;
        
        case 'give':
        socket.emit('sync');
      words.shift();
        if (!database.profiles.includes(username.toLowerCase())){return log("Please create a user with '"+prefix+"register' !")}
        if (!database.moderators.includes(username.toLowerCase())||!database.admins.includes(username.toLowerCase())){return log(staff_only)}
        var amount = words.join(' ');
      if (amount){
        socket.emit('add coin',amount);
        log("You have "+database.coins[username.toLowerCase()]+" coins.");
    }
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'give 12345')}

        break;
        
        
        

      case 'say':// Slaps the text given
      words.shift();
      var jchat = words.join(' ');
        var cat='kitty'
      if (cat='kitty') {
      addChatMessage({
          username: botname,
          message: jchat
        });
        socket.emit('bot message',jchat);}
        else{
          log('Please use the command correctly, also must have less than 10 letters, ' +
              'Example '+prefix+'say cat', {})}
        break;
        
      case 'ree':// Slaps the text given
          var audio = new Audio('https://cdn.glitch.com/b792ab51-deee-4647-a7bb-4717144ab5da%2Freeeeee-sound-effect-2oGr22XU.mp3?v=1574807326622');
          audio.play();
          addChatMessage({
          username: botname,
          message: 'REEEEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeee'
        });
        socket.emit('bot message','REE');

        break;
      case 'img':// Slaps the text given
          addChatImage({
          username: botname,
          message: 'REEEEEEEEEEEEEEEEEEEEEeeeeeeeeeeeeeeee'
        });
        break;
        
        case 'cf': //coinflip
          var prob1 = Math.floor(Math.random() * 2) +1;
          var prob2 = Math.floor(Math.random() * 2) +1;
          if( prob1 === prob2){
          socket.emit('bot message',`${username}, flipped a coin and got heads!`);
          addChatMessage({username: botname,message:username+' flipped a coin and got Heads'});
          }else{
          addChatMessage({username: botname,message:username+' flipped a coin and got Heads'});
          socket.emit('bot message',`${username}, flipped a coin and got tails!`);
          }
        break;
        
      default:
        message = 'You have entered an invalid command';
        log(message);
        break;
    }
  }

  // Log a message
  function log (message, options) {
    options = options || {};
    var $logDiv;

    if (typeof options.userConnEvent !== 'undefined') {
      var userName = options.username;
      var colorOfUserName = getUsernameColor(userName);
      var $usernameDiv = $('<span class="username">')
        .text(userName)
        .css('color', colorOfUserName);
      // var $logBodyDiv = $('<span>').text(message);
      $logDiv = $('<li>')
        .addClass('log')
        .append($usernameDiv, message);
      addMessageElement($logDiv, options);
    } else {
      $logDiv = $('<li>').addClass('log').text(message);
      addMessageElement($logDiv, options);
    }
  }

  // Adds the visual chat message to the message list
  function addChatMessage (data, options) {
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
      var $usernameDiv = $('<span class="username"/>')
        .text(userName)
        .css('color', colorOfUserName);
      var $messageBodyDiv = $('<span class="messageBody">')
        .text(data.message);

      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>')
        .data('username', userName)
        .addClass(typingClass)
        .append($usernameDiv, $messageBodyDiv);

      addMessageElement($messageDiv, options);
    }
  }
  
function addChatImage (data, options) {
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
      var usernameDiv = $('<span class="username"/>').text(userName).css('color', colorOfUserName);
      var messageBodyDiv = $('<img src="https://www.w3schools.com/html/pic_trulli.jpg" alt="Trulli" width="500" height="333">')

      var typingClass = data.typing ? 'typing' : '';
      var $messageDiv = $('<li class="message"/>').data('username', userName).addClass(typingClass).append(usernameDiv, messageBodyDiv);

      addMessageElement($messageDiv, options);
  }
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
  function addMessageElement (el, options) {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    // When sending message, make screen to last message (here is bottom).
    //noinspection JSUnresolvedVariable
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  // Prevents input from having injected markup
  function cleanInput (input) {
    return $('<div/>').text(input).text();
  }

  // Updates the typing event
  function updateTyping () {
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

  // Keyboard events

  $window.keydown(function (event) {
    // Auto-focus the current input when a key is typed
    //noinspection JSUnresolvedVariable
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
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

  $inputMessage.on('input', function() {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(function () {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(function () {
    $inputMessage.focus();
  });

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
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
    log(data.logAction + data.logLocation + data.roomName, {
      userConnEvent: true,
      username: data.username
    });
    addParticipantsMessage(data);
    socket.emit('room list');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    log(data.logAction + data.logLocation + data.roomName, {
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
    $roomList.empty();
    var roomClassName = room.trim().toLowerCase().replace(/\s/g,'');

    $.each(rooms, function (roomName, numUserInRoom) {
      // Set class name of room's <div> to be clear.
      var className = roomName.trim().toLowerCase().replace(/\s/g,'');
      $roomDiv = $('<div class="room"></div>')
        .html('<b>' + roomName + '</b>'
          + '<span class="user-number-in-room">'
          + '(' + numUserInRoom + ' users' + ')' + '</span>')
        .addClass(className)
        .click(function () {
          socket.emit('join room', roomName);
          $inputMessage.focus();
        });
      $roomList.append($roomDiv);
    });

    $('.' + roomClassName).addClass('joined-room');
  });

  socket.on('join left result', function (data) {
    // log results.
    log(data.username + data.logAction
      + data.logLocation + data.roomName, {});
  });

  // Every 30 secs. reload current room list.
  setInterval(function () {
    socket.emit('room list');
  }, 30000);


  // jQuery UI Style
  $roomList.sortable();
  $btnTips.tooltip();
  $btnTips.on( "click", function() {
    $('#effect-tips').toggle('blind');
  });
});
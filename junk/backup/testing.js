//without cookies
function setUsername () {
    // If user name is input, get and then emit 'add user' event.
    // trim(): remove the whitespace from the beginning and end of a string.
    
    username = cleanInput($usernameInput.val().trim());
    

    if(typeof database.profiles == "undefined"){
      setTimeout(setUsername, 250);return console.log('tis')
    }
    if (database.profiles.includes(username.toLowerCase())) {
          var pass_input = prompt("Please input the password for the account @"+username, "");
  if (pass_input == null || pass_input == "") {
    {location.reload();return}
  } else {
if (database.user[username.toLowerCase()]==pass_input.toLowerCase()){alert("Success!"); setCookie("logged-in", username, 30);} else{alert("Wrong password!");return location.reload();}
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

//Username script with cookies
function setUsername () {
    // If user name is input, get and then emit 'add user' event.
    // trim(): remove the whitespace from the beginning and end of a string.
    
    username = cleanInput($usernameInput.val().trim());
    

    if(typeof database.profiles == "undefined"){
      setTimeout(setUsername, 250);return console.log('tis')
    }
    if (database.profiles.includes(username.toLowerCase())) {
      if (existsCookie("logged-in")){//Checks to see if there is a cookie for an account logged in
        if (valueCookie("logged-in")!==username) {//Checks to see if the cookie matches the current account or not
          var pass_input = prompt("Please input the password for the account @"+username, "");
  if (pass_input == null || pass_input == "") {
    {location.reload();return}
  } else {
if (database.user[username.toLowerCase()]==pass_input.toLowerCase()){alert("Success!"); setCookie("logged-in", username, 30);} else{alert("Wrong password!");return location.reload();}
  }
        } 
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
// Setup basic express server
const express = require("express");
const fs = require("fs");
var cookieParser = require("cookie-parser");
var database_location=__dirname + "/database.json";
const database = JSON.parse(fs.readFileSync(database_location));
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const config = require(__dirname + "/config.json");
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
var cartoonavatar = require("cartoon-avatar");
var port = process.env.PORT || 3232;
var hostname = config.url; // replace with the web domain you are currently using Ex. google.com which will then be a variable to added to https:// HOSTNAME then whatever redirect it's supposed to be
var currency = "Coins";
var prefix = "$";
var anti = "this.value = this.value.replace(/[^a-z0-9]/i, '')";
//const User = require('./modules/dashboard');
//var Message = require('./modules/tools/msg');
var variable_pack = require('../modules/tools/variablepack');
var function_pack = require('../modules/tools/functionpack');
var cors = require('cors');
var logs = {
  views: {},
  changes: {}
};

// Routing
app.use(cookieParser());
app.use(express.static(__dirname + "/../public"));
app.use('/tools',express.static(__dirname + "/../modules/tools"));
app.set("view engine", "ejs");


function msg(type, part, url, version) {var Message = require('../modules/msg');return new Message(type, part, url, version).value()}

var date = new Date();

var time = variable_pack.time;

do_am_pm();

var am_pm;

function do_am_pm() {
  if (date.getHours() - 4 < 12) {
    am_pm = "AM";
  } else if (date.getHours() - 4 > 12) {
    am_pm = "PM";
  } else {
    am_pm = "broken??";
  }
}

server.listen(port, function() {
  console.log("Server listening at port %d", port);
  console.log(
    `Time: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours() - 4}:${date.getMinutes()}:${date.getSeconds()} ${am_pm}`
  );
});

function save_database() {
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  console.log(`Saving Database on bot server!`);
  setTimeout(save_database(), 240000);
}
function real_user(username,password,debug){
  if(!database.user[username]){return false;if(debug===true){console.log("User with this username does not exist.");}}else
  if(!bcrypt.compareSync(password,database.user[username].password)){return false;console.log("Incorrect username or password.");}else
  {
    return true;
  } 
}
async function mail(to, subject, text, html) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    //requireTLS: true,
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Meown No-reply" <themittzcat@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

//mail(to,subject,text,html).catch(console.error);

app.get("/data", (request, response) => {response.render("database", { qs: request.query });});

app.post("/result", urlencodedParser, (request, response) => {
  console.log(request.body);
  if (request.body.sentpass.toLowerCase() == config.passcode) {
    response.send(JSON.stringify(database, null, 2));
  } else {
    response.send("<br>Password sent: " +request.body.sentpass.toLowerCase() +"<br>Status: Failed");
  }
});
function render_login(type,me){
  if (!type){type = "login";}
  if (type === "login"){
    if (me){
  var values ={method:"get",action:"/logout",title:`Logout`,fields:`<br>`,button:"Log Out",body:"You are currently Logged In.<br>Click to log out!",}
  return values;
  }
  else{
  var values ={method:"POST",action:"/login",title:`Login`,button:"Log In",body:"Hello!"+`<br><br><a href="/register">Register</a> | <a href="#">Forgot</a> | `,
  fields:`
  <input type="text" name="sentname" placeholder="Username" required/><input type="password" name="sentpass" placeholder="Password" required/>
  `
  }
  return values;
  }
}else if (type === "register"){
    var values ={method:"POST",action:"/register",title:`Register`,button:"Create account!",body:"Welcome to meown if your are new please create an account with the correct details and then click Create account!"+`<br><br><a href="/login">Login</a> |`,
    fields:`
    <input type="text" name="sentname" placeholder="Username" required/><input type="text" name="sentdesc" placeholder="Description" required/><input type="password" name="sentpass" placeholder="Password" required/><input type="password" name="sentpassconfirm" placeholder="Password Confirm" required/><input type="email" name="sentemail" placeholder="Email" required/>
    `
  }
  return values;
}
  
}
app.get("/terms", (request, response) => {
  return response.render("terms");
});

app.get("/login", (request, response) => {
  var me = request.cookies["saved-username"];
  var values = render_login("login",me)
  return response.render("login", { values:values });
});

app.get("/register", (request, response) => {
  var me = request.cookies["saved-username"];
  var values;
  if (me){values = render_login("login",me)}
  else{values = render_login("register",me)}
  return response.render("login", { values:values });
});

app.get("/dashboard", (request, response) => {
  var me = request.cookies["saved-username"];
  if (!me) {
    return response.send(msg("not_logged", "Username", "u"));
  }
  if (real_user().result === true) {
    return response.send(msg("incorrect", "Username", "u"));
  }

  var values = {
    database: database,username: me,currency: currency,
    followers: database.user[me].followers,recent_followers: "",follows: database.user[me].following,recent_follows: "",
    changes: logs.changes[me],recent_changes: "",reports:"database.mini.reports.glitches[me]",
    recent_reports: "",last: 3,i: "",
    views: "",forms: "",staff:false
  };
if (database.user[me].roles.includes("developer")||database.user[me].roles.includes("moderator")){
  values.staff = true;
}
  if (values.changes) {
    values.last = function_pack.max(values.changes.length,2);
    for (values.i = 0; values.i < values.last; values.i++) {
      if (typeof database.user[me] !== "undefined") {
        values.recent_changes += `<li class="simple-padding-16">
        <img src="${database.user[me].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${me}">${values.changes[values.i + values.changes.length - values.last]}</a></span><br>
      </li>`;
      }
    }
  } else {
    values.recent_changes = "None";
  }
  if (values.follows !== "") {
    values.last = function_pack.max(values.follows.length,2);
    for (values.i = 0; values.i < values.last; values.i++) {
      if (typeof database.user[values.follows[values.i + values.follows.length - values.last]] !== "undefined") {
        values.recent_follows += `<li class="simple-padding-16">
        <img src="${database.user[values.follows[values.i + values.follows.length - values.last]].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${values.follows[values.i + values.follows.length - values.last]}">${values.follows[values.i + values.follows.length - values.last]}</a></span><br>
      </li>`;
      }
    }
  } else {values.recent_follows = "None";}
  
  if (values.followers !== "") {
    values.last = function_pack.max(values.followers.length,3);
    for (values.i = 0; values.i < values.last; values.i++) {
      if (typeof database.user[values.followers[values.i + values.followers.length - values.last]] !== "undefined") {
        values.recent_followers += `<div class="simple-row">
      <div class="simple-col m2 text-center">
        <img class="simple-circle" src="${database.user[values.followers[values.i + values.followers.length - values.last]].avatar}" style="width:96px;height:96px">
      </div>
      <div class="simple-col m10 simple-container">
        <h4>${values.followers[values.i + values.followers.length - values.last]} <span class="simple-opacity simple-medium">Follower #${values.i +
          values.followers.length -values.last}</span></h4>
        <br>
      </div>
    </div>`;
      }
    }
  } else {values.recent_followers = "None";}
  
  if (!logs.views[me]) {values.views = 0;}
  if (logs.views[me]) {values.views = logs.views[me];}
  var new_el = function_pack.new_el;
  function new_feed(values){
    if (!values.text){values.text=""}
    if (!values.when){values.when=""}
    if (!values.text){values.text=""}
return new_el({"element":"tr",type:"double",value:
new_el({"element":"td",type:"double",value:new_el({"element":"i",type:"double",class:`fa fa-${values.icon} simple-text-blue simple-large`})})+
new_el({"element":"td",type:"double",value:values.text})+new_el({"element":"i",type:"double",value:values.when})

})
  }
  response.render("dashboard.ejs", { database: database, values: values });
});

app.post("/edit", urlencodedParser, (request, response) => {
  var method = request.body.method;
  
  var me = request.cookies["saved-username"];
  
  if (!method) {return response.send(msg("missing", "Method", "u"));}
  
  if (me == undefined ||!me) {return response.send(msg("include", "Username", "u"));}
  
  if (typeof database.user[me] == "undefined") {return response.send(msg("no_account", "Username", ""));}
  
  if (!bcrypt.compareSync(request.cookies["saved-password"],database.user[me].password)) {
    return response.send(msg("incorrect", "Username", "dashboard"));
  }

  
  if (method === "details") {
    var text_add = "";
    if (request.body.sentnewpass) {
      database.user[me].password = request.body.sentnewpass;
      text_add += `New Password: ${request.body.sentnewpass}`;
    }
    if (request.body.sentnewdesc) {database.user[me].description = request.body.sentnewdesc;}
    
    if (request.body.sentnewavatar) {database.user[me].avatar = request.body.sentnewavatar;}
    
    if (database.user[me].roles.includes("developer") ||database.user[me].roles.includes("moderator")) {
      
      if (request.body.sentnewbackground) {database.user[me].background =request.body.sentnewbackground;}
      
      if (request.body.sentnewbanner) {database.user[me].banner =request.body.sentnewbanner;}
      
    }
    
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));

    return response.send(msg("edited", "Username", "u"));
  } else 
    
    
    if (method === "new-post") {
    if (!request.body.sentposttitle) {return response.send(msg("include", "Post Title", "u"));}
      
    if (!request.body.sentpostbody) {return response.send(msg("include", "Post Body", "u"));}
      
    if (!request.body.sentpostcategory) {return response.send(msg("include", "Post Category", "u"));}
      
    if (!request.body.id) {return response.send(msg("include", "ID (user / community)", "u"));}
      
      
    if (function_pack.html_check(request.body.sentposttitle) || function_pack.html_check(request.body.sentpostbody)) {return response.send(msg("custom", "Do not use html!", "u"));}
    var text = "", category= request.body.sentpostcategory,id = request.body.id,post_type = "user";
      
    if (id !== me&&category==="user"){category="community";id=`null`}
    var i = 0;
    while (i < request.body.sentpostbody.length &&request.body.sentpostbody.includes("!n ")) {
      request.body.sentpostbody = request.body.sentpostbody.replace("!n ","<br>");
      i++;
    }
    if (database[category][id].posts) {
      if (database[category][id].posts.includes(request.body.sentposttitle.toLowerCase())) {return response.send(msg("post_exists", "", "u"));}
    }
    if (!database[category][id].posts) {database[category][id].posts = [];}
    var details={
      title: request.body.sentposttitle,
      body: request.body.sentpostbody,
      likes: [],
      comments: []
    }
    if (category==="community"){details.sender = me;}
    database[category][id].posts.push(details);
    database.user[me].coins += 1;
    database.user[me].xp += 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("post_created","Username",`${category[0]}?username=${me}#${database[category][id].posts.length - 1}`));
  } else 
    
    
    if (method === "report") {
    if (!request.body.sentposttitle) {return response.send(msg("include", "Post Value", "u"));}
    if (!request.body.sentpostbody) {return response.send(msg("include", "Post Value", "u"));}
    if (function_pack.html_check(request.body.sentposttitle) ||function_pack.html_check(request.body.sentpostbody)) {return response.send(msg("custom", "Do not use html!", "u"));}

    if (database.user[me].posts) {
      if (database.user[me].posts.includes(request.body.sentposttitle.toLowerCase())) {
        return response.send(msg("post_exists", "", "u"));
      }
    }
    if (!database.user[me].posts) {
      database.user[me].posts = [];
    }
    database.user[me].posts.push({title: request.body.sentposttitle,body: request.body.sentpostbody,likes: [],comments: []});
    database.user[me].coins += 1;
    database.user[me].xp += 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("post_created","Username",`u?username=${me}#${database.user[me].posts.length - 1}`,"redirect"));
  } else 
    
    
    if (method === "delete-post") {
    if (!database.user[me].posts[request.body.sentnum]) {
      return response.send(msg("post_does_not_exist", "", "u"));
    }
    database.user[me].posts.splice(request.body.sentnum,1);
    if (!logs.changes[me]) {logs.changes[me] = [];}
    if (logs.changes[me]) {logs.changes[me].push(`Post #${request.body.sentnum} Deleted "${database.user[me].posts[request.body.sentnum]}"`);}
    database.user[me].coins -= 1;
    database.user[me].xp -= 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("post_deleted","Username",`u?username=${me}#${database.user[me].posts.length - 1}`,"redirect"));
  } else 
    
    
    if (method === "redeem") {
    if (typeof config.codes[request.body.sentcode] == "undefined") {return response.send(msg("custom", "Invalid Code!", "dashboard"));}
    if (database.user[me].codes.includes(request.body.sentcode)) {return response.send(msg("custom", "Code Exists!", "dashboard"));}
    if (!logs.changes[me]) {logs.changes[me] = [];}
    if (logs.changes[me]) {logs.changes[me].push(`Code Redeemed: "${request.body.sentcode}" for ${config.codes[request.body.sentcode]} ${currency} `);}
    database.user[me].codes.push(request.body.sentcode);
    database.user[me].coins += config.codes[request.body.sentcode];
    return response.send(msg("custom", "Code Redeemed", `dashboard`));
  } else 
    
    
    if (method === "like") {
    var type;
    var check;
    if (!database.user[me].posts) {response.send(msg("missing", "Post??!!", "u"));}
    if (!request.body.sentid) {return response.send(msg("include", "Post Value", "u"));}
    if (!request.body.type) {return response.send(msg("include", "Type", "u"));}
    else {type = request.body.type;}
    if (type === "posts") {check = database.user[request.body.sentname].posts[request.body.sentid];}
    if (type === "thread") {check = database.community[request.body.sentname].posts[request.body.sentid];}
    else {response.send(msg("custom", "Error??!!", "u"));}

    if (!check.likes.includes(me)) {
      check.likes.push(me);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${me}&notification=${type}+Liked!'"/>`);
    } else {
      check.likes = check.likes.filter(item => item !== me);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${me}&notification=${type}+UnLiked!'"/>`);
    }
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(
      msg("custom",`${type}`,`u?username=${me}#${database.user[me].posts.length - 1}`,"redirect")
    );
  } else 
    
    
    if (method === "new-thread") {
    var community = request.body.sentcommunity;
      
    if (!request.body.sentcommunity) {return response.send(msg("include", "Comment Value", "u"));}
      
    if (!request.body.sentposttitle) {return response.send(msg("include", "Post Value", "u"));}
      
    if (!request.body.sentpostbody) {return response.send(msg("include", "Post Value", "u"));}
      
    if (function_pack.html_check(request.body.sentposttitle) || function_pack.html_check(request.body.sentpostbody)) {return response.send(msg("custom", "Do not use html!", "u"));}

    if (database.user[community].thread) {
      if (database.user[community].thread.includes(request.body.sentposttitle.toLowerCase())) {
        return response.send(msg("post_exists", "", "u"));
      }
    }
    if (!database.user[community].thread) {database.user[community].thread = [];}
      
    database.user[community].thread.push({sender: me,title: request.body.sentposttitle,body: request.body.sentpostbody,likes: [],comments: []});
      
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      
    return response.send(msg("post_created","Username",`c?search=${community}#${database.user[me].posts.length - 1}`,"redirect"));
  } else 
    
    
    if (method === "new-post-comment") {
    if (!request.body.sentcomment) {return response.send(msg("include", "Comment Value", "u"));}
    if (!request.body.commentid) {return response.send(msg("include", "Comment Id", "u"));}
    if (database.user[me].posts &&database.user[me].posts[request.body.commentid].comments) {
      if (database.user[me].posts[request.body.commentid].comments.includes(request.body.sentcomment.toLowerCase())) {return response.send(msg("post_exists", "", "u"));}
    }
    if (!database.user[me].posts) {database.user[me].posts = [];}
    if (function_pack.html_check(request.body.sentcomment.toLowerCase())) {
      return response.send("Bad!");
    }
    database.user[me].posts[request.body.commentid].comments.push({ sender: me, text: request.body.sentcomment });
    database.user[me].coins += 0.2;
    database.user[me].xp += 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("post_created","Username",`u?username=${me}#${database.user[me].posts.length - 1}`,"redirect"));
  } 
  else 
    
    
    if (method === "new-community") {
    if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {
      return response.send(msg("exists", "d", "u"));
    }
    if (!request.body.sentcommunity) {return response.send(msg("invalid", "Community", "register"));}
    if (!request.body.sentdesc) {return response.send(msg("invalid", "Description", "register"));}
    if (typeof database.community[request.body.sentcommunity.toLowerCase()] === "undefined") {
      
      database.user[me].communities.push(request.body.sentcommunity.toLowerCase());
      
      database.community[request.body.sentcommunity.toLowerCase()] = {
        owner: me,
        preferred: request.body.sentcommunity,
        background: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
        banner: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
        description: request.body.sentdesc.toLowerCase(),
        color: "#000000",
        members:[],
        avatar: "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png",
        creation_date: Date.now()
      };

      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      response.send(msg("custom", "", `c?search=${request.body.sentcommunity}`));
    }
  } /*else if (method === "new-thread-comment") {
    if (!request.body.sentcommunity) {return response.send(msg("include", "Comment Value", "u"));}
    var community = request.body.sentcommunity;
    if (!request.body.sentcomment) {return response.send(msg("include", "Comment Value", "u"));}
    if (!request.body.commentid) {return response.send(msg("include", "Comment Id", "u"));}
    if (database.community[community].thread &&database.community[community].thread[request.body.commentid].comments) {
      if (database.community[community].thread[request.body.commentid].comments.includes(request.body.sentcomment.toLowerCase())) {
        return response.send(msg("post_exists", "", "u"));
      }
    }
    if (!database.community[community].thread) {database.community[community].thread = [];}
    if ((request.body.sentcomment.toLowerCase().includes("<") && request.body.sentcomment.toLowerCase().includes(">")) ||(request.body.sentcomment.toLowerCase().includes("<") && request.body.sentpost.toLowerCase().includes("/"))) {
      return response.send("Bad!");
    }
    database.community[community].thread[request.body.commentid].comments.push({sender: me,text: request.body.sentcomment});
    database.user[me].coins += 0.2;
    database.user[me].xp += 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("post_created","Username",`c?search=${community}#${database.thread[community].length - 1}`,"redirect"));
  }*/ else {
    return response.send(msg("missing", "Method lol", "u"));
  }
});

app.get("/connect", urlencodedParser, (request, response) => {
  var method = request.query.method,user = request.query.user.toLowerCase(),me = request.cookies["saved-username"].toLowerCase();
  
  if (!user) {return response.send(msg("missing", "user", "u"));}
  if (!method) { return response.send(msg("missing", "Method", "u"));}
  if (me == undefined ||!me) {return response.send(msg("include", "Username", "u"));}
  if (typeof database.user[me] === "undefined") {return response.send(msg("no_account", "Username", ""));}
  if (!bcrypt.compareSync(request.cookies["saved-password"],database.user[me].password)) {return response.send(msg("incorrect", "Username", "dashboard"));}
  if (method==="join" && typeof database.community[user] === "undefined") {return response.send(msg("custom", "ERROR", "c",`&search=${user}`));}

  if (method === "follow") {
    if (me === user){return response.send(msg("custom","You cannot follow yourself!",""))}
    if (!database.user[me].following.includes(user)) {
      database.user[me].following.push(user);
      database.user[user].followers.push(me);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${me}&notification=User+Followed!'"/>`);
    } else {
      database.user[me].following = database.user[me].following.filter(item => item !== user);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(
        `<meta http-equiv="Refresh" content="0; url='/u?username=${
          request.cookies["saved-username"]
        }&notification=User+Unfollowed!'"/>`
      );
    }
  } else if (method === "join") {
    if (!database.user[me].following.includes(user)) {
      database.community[user].members.push(me);
      database.user[me].communities.push(user);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${me}&notification=User+Followed!'"/>`);
    } else {
      database.community[user].members = database.community[user].members.filter(item => item !== me);
      database.user[me].communities = database.user[me].communities.filter(item => item !== user);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${me}&notification=User+Unfollowed!'"/>`);
    }
  }
});

app.post("/login", urlencodedParser, (request, response) => {
  if (!request.body.sentname || !request.body.sentpass) {return response.send(msg("include", "Username and Password", "u"));}
  if (typeof database.user[request.body.sentname] == "undefined") {return response.send(msg("no_account", "", "u"));}
  if (bcrypt.compareSync(request.body.sentpass,database.user[request.body.sentname.toLowerCase()].password)) {
    if (request.cookies["saved-username"] && request.cookies["saved-password"]) {
      return response.send(msg("logged_in", "", "u"));
    } else {
      response.cookie("saved-username", request.body.sentname.toLowerCase(), {maxAge: 1.296e9});
      response.cookie("saved-password", request.body.sentpass, {maxAge: 1.296e9});
      return response.send(msg("logged_in", "", "u", "redirect"));
    }
  } else {
    return response.send(msg("incorrect", "Password", "u"));
  }
});

app.get("/logout", urlencodedParser, (request, response) => {
  if (!request.cookies["saved-username"] &&!request.cookies["saved-password"]) {
    return response.send(msg("logged_not", "", "u", "redirect"));
  } else {
    response.cookie("saved-username", request.cookies["saved-username"], {maxAge: 0});
    response.cookie("saved-password", request.cookies["saved-password"], {maxAge: 0});
    return response.send(msg("logout", "", "u", "redirect"));
  }
});

app.get("/u-text", urlencodedParser, (request, response) => {
  var username = request.query.search.toLowerCase();
  if (typeof database.user[username] == "undefined") {
    return response.send(msg("no_account", "", "u"));
  }
  var values = {
    "post_number":0,
    "post_list":"",
    "comment_number":0,
    "comment_list":""
  }

  
  
  
  while (values.post_number < database.user[username].posts.length){
    var num = values.post_number;values.comment_list="";
  while (values.comment_number < database.user[username].posts[num].comments.length){
    var num2 = values.comment_number;var sender = database.user[username].posts[num].comments[num2].sender
    if (!database.user[sender]){sender = "Deleted User"}
    values.comment_list += `<p>${sender}: ${database.user[username].posts[num].comments[num2].text}</p>
    `
    values.comment_number++
  }
    values.post_list += `<li><p>${username}: ${database.user[username].posts[num].title}</p><p>${database.user[username].posts[num].body}</p>
    <p>Likes: ${database.user[username].posts[num].likes.length}</p><p>Comments: ${values.comment_list}</p></li>
    `
    values.post_number++
  }
  response.send(
    `Username: ${request.query.search.toLowerCase()} 
     <br> Description: ${database.user[username].description} 
     <br> ${currency}: ${database.user[username].coins} 
     <br> Creation Date: ${database.user[username].creation_date}
     <hr>
     ${values.post_list}
    `
    
  );
});

app.post("/register", urlencodedParser, (request, response) => {
  //console.log(request.body);
  var avatar;
  if (typeof database.user[request.body.sentname.toLowerCase()] !== "undefined") {
    return response.send(msg("exists", "d", "u"));
  }
  if (request.body.sentname == null ||request.body.sentname == undefined ||!request.body.sentname) {
    return response.send(msg("invalid", "Username", "register"));
  }
  if (request.body.sentpass == null ||request.body.sentpass == undefined ||!request.body.sentpass) {
    return response.send(msg("invalid", "Password", "register"));
  }
  if (request.body.sentdesc == null ||request.body.sentdesc == undefined ||!request.body.sentdesc) {
    return response.send(msg("invalid", "Description", "register"));
  }
  if (request.body.sentpass !== request.body.sentpassconfirm) {
    return response.send(
      msg("match", "password & confirm password", "register")
    );
  }
  //if (request.body.sentname.includes("_")||request.body.sentname.includes("!")||request.body.sentname.includes("_"))
  if (function_pack.a0(request.body.sentname) || function_pack.html_check(request.body.sentdesc)) {
    return response.send(msg("custom", "Do not use custom characters or html!", "u"));
  }
  if (typeof database.user[request.body.sentname.toLowerCase()] == "undefined") {
    response.cookie("saved-username", request.body.sentname.toLowerCase(), {maxAge: 1.296e9
    });
    response.cookie("saved-password", request.body.sentpass, {maxAge: 1.296e9});
    database.emails.push(request.body.sentemail.toLowerCase());
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(request.body.sentpass, salt);
    database.user[request.body.sentname.toLowerCase()] = {
      password: hash,
      email: request.body.sentemail,
      coins: 50,
      xp: 0,
      background: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      banner: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      description: request.body.sentdesc.toLowerCase(),
      avatar: "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png",
      following: [],
      followers: [],
      communities: [],
      codes: [],
      posts:[],
      /*Delete badges if needed*/ roles: [],
      creation_date: Date.now()
    };
    mail(request.body.sentemail,`Your account, ${request.body.sentname} on Meown`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
    console.log(`Account created, Username: ${request.body.sentname.toLowerCase()}, Password: ${request.body.sentpass.toLowerCase()} , Description: ${request.body.sentdesc.toLowerCase()}`);
  }
});

app.post("/new-community", urlencodedParser, (request, response) => {
  var avatar;
  if (
    typeof database.community[request.body.sentcommunity.toLowerCase()] !==
    "undefined"
  ) {
    return response.send(msg("exists", "d", "u"));
  }
  if (request.body.sentcommunity == null ||request.body.sentcommunity == undefined ||!request.body.sentname) {
    return response.send(msg("invalid", "Username", "register"));
  }
  if (request.body.sentdesc == null ||request.body.sentdesc == undefined ||!request.body.sentdesc) {
    return response.send(msg("invalid", "Description", "register"));
  }
  if (function_pack.a0(request.body.sentcommunity) || function_pack.html_check(request.body.sentdesc)) {
    return response.send(msg("custom", "Do not use custom characters or html!", "u"));
  }
  if (typeof database.user[request.body.sentname.toLowerCase()] == "undefined") {
    if (!request.body.avatar) {
      avatar =
        "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
    } else if (request.body.avatar) {
      if (request.body.avatar === "male") {
        avatar = cartoonavatar.generate_avatar({ gender: "male" });
      } else if (request.body.avatar === "female") {
        avatar = cartoonavatar.generate_avatar({ gender: "female" });
      } else if (request.body.avatar === "default") {
        avatar =
          "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
      } else {
        avatar =
          "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
      }
    }
    response.cookie("saved-username", request.body.sentname.toLowerCase(), {maxAge: 1.296e9});
    response.cookie("saved-password", request.body.sentpass, {maxAge: 1.296e9});
    database.emails.push(request.body.sentname.toLowerCase());
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(request.body.sentpass, salt);
    database.community[request.body.sentname.toLowerCase()] = {
      password: hash,
      email: request.body.sentemail,
      coins: 50,
      xp: 0,
      preferred: request.body.sentname,
      background: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      banner: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      description: request.body.sentdesc.toLowerCase(),
      color: "#000000",
      avatar: avatar,
      following: [],
      followers: [],
      members: [],
      creation_date: Date.now()
    };
    mail(request.body.sentemail,`Your account, ${request.body.sentname} on Meown`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
    console.log(`Account created, Username: ${request.body.sentname.toLowerCase()}, Password: ${request.body.sentpass.toLowerCase()} , Description: ${request.body.sentdesc.toLowerCase()}`);
  }
});
//console.log(bcrypt.hashSync("123123123aouabepic", bcrypt.genSaltSync(10)))
/*var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("2004secret", salt);
console.log(hash)*/

function info_data(x) {
  return `
<title>Meown Chat | ${function_pack.caps(x)}</title>
<meta property="og:title" content="Meown | ${function_pack.caps(x)}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://meown.tk" />
<meta property="og:image" content="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664" />
<meta property="og:description" content="The newest, worst social media." />
<meta name="theme-color" content="#cb3837">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">
<link id="favicon" rel="icon" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png" type="image/x-icon">
`;
}
app.get("/api", cors(), (request, response) => {
  var search = request.query.search;
  var method = request.query.method;
  if (!method) {response.json({ response: "method" });}
  if (method) {
    if (method === "user") {
      if (!search) {response.json({ response: "name_/_id_/_variant" });}
      if (typeof database.user[search] == "undefined") {response.json({ response: "user_from_database" });}
      var user = database.user[search];
      const cloneuser = Object.assign({}, user);
      delete cloneuser.password;
      delete cloneuser.email;
      if (request.query.includeposts!=="true"){delete cloneuser.posts}
      return response.json({status:200,response:cloneuser});
    } else 
      
      if (method === "user_list") {
      return response.json({status:200,result:Object.keys(database.user)});
    } else 
      
      if (method === "communities") {
      return response.json({status:500,result:Object.keys(database.community)});
    } else 
      
      if (method === "config") {
      var data = JSON.parse(JSON.stringify(config))
      delete data.passcode;delete data.codes
      return response.json({status:200,result:data});
    } else {
      return response.json({status:500,response: "no_results" });
    }
  }
});

function social(values) {
  if (!logs.views[values.id]) {
      logs.views[values.id] = 0;
    }
    logs.views[values.id] += 1;
  var Page = require('../modules/page');return new Page(values, database).value();
}

function get_roles() {
  var roles = {};
  var i;
  var i2;
  var user;
  for (i = 0; i < Object.keys(database.user).length; i++) {
    user = Object.keys(database.user)[i]; //Get each user details
    for (i2 = 0; i2 < Object.keys(database.user[user].roles).length; i2++) {
      //Get each users roles
      if (!roles[database.user[user].roles[i2]]) {
        roles[database.user[user].roles[i2]] = [];
      }
      if (!roles[database.user[user].roles[i2]].includes(user)) {
        var usercap = user.charAt(0).toUpperCase() + user.slice(1);
        roles[database.user[user].roles[i2]].push(usercap);
      }
    }
  }
  return roles;
}

function custom(values) {
  if (typeof values.background === "undefined") {
    values.background = "simple-theme.css";
  }
}
app.get("/error", (request, response) => {
    var text = request.query.text,value = request.query.value,who = request.query.who,symbols=[];
  if (!value){value = "huh?"}
    if (who){text[0]=who+" "}
    var i;for (i = 0; i < value.length; i++) {
      var overlay="",emoji_letters = ["U","u","O","o","D","n"]
      if (emoji_letters.includes(value.charAt(i)))
      {overlay="🐈"}
      symbols.push({"symbol":value.charAt(i),"overlay":overlay})
    }
      response.render("error.ejs", {error:JSON.stringify({
    "code":symbols,
    "buttons":[{"url":"window.history.back();","text":"Back"},{"url":"location.replace('/');","text":"Homepage"}
               /*,{"url":"location.replace('/u');","text":"My Page"}*/],
    "text":text,
    "type":value
  })
  });
});
app.get("/u", (request, response) => {
  var username = request.query.search;
  var me = request.cookies["saved-username"];
  function banned(type,who){

  }
  if (!username) {
    if (me) {
      username = me;
    } else {response.send(msg("no_account", null, "login"));}
  }
  if (typeof database.user[username] === "undefined") {
    return response.send(msg("no_account", null, "u"));
  }
  if (database.user[username].roles.includes("banned")){banned("BANNED")}
  if (database.user[username].roles.includes("suspended")){banned("SUSPENDED")}
  var values = {
    username: username,
    id: username,
    category: "user",
    background: request.cookies["saved-background"],
    data_type: database.user,
    password: request.cookies["saved-password"],
    currency: currency,
    me: me,
    time: time,
    anti: anti,
    hostname: request.hostname,
    post_number: 0,
    post_list: "",
    comment_number: "",
    comment_list: "",
    role_number: "",
    role_list: get_roles(),
    follow_number: "",
    follow_list: "",
    follow_amount: database.user[username].followers.length,
    community_number: "",
    community_list: "",
    like_number: "",
    like_list: "",
    status: "",
    post_bar: "",
    comment_bar: "",
    profile_menu: "",
    side_bar: "",
    scripts: "",
    self_avatar: "https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    self_link: "/u#login",
    nav: "",
    nav_mobile: "",
    info_data: info_data,
    i: "",
    details: "",
    visible: {
      logged_in: "",
      logged_out: "hidden",
      post_bar: "hidden"
    }
  };

    if (!logs.views[values.id]) {
      logs.views[values.id] = 0;
    };logs.views[values.id] += 1;
  var Page = require('../modules/page');new Page(values, database).value();
  custom(values);
  //var get = new main(database, mini,username,null,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar);
  //response.send(get.u());
  var delete_passwords;
  //const data = Object.assign({}, database);
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
    delete_passwords = Object.keys(data.user)[values.i];
    delete data.user[delete_passwords]["password"];
  }
  response.render("page.ejs", { database: data, values: values });
});

app.get("/c", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var community = request.query.search;
  var me = request.cookies["saved-username"];
  //if (!me){me = "null"}
  if (!community) {community = "meown";}
  if (typeof database.community[community]  === "undefined") {
    return response.send(msg("custom", "No community with this name", "c","&search=meown"));
  }
  var values = {
    username: community,
    id: community,
    category: "community",
    data_type: database.community,
    password: request.cookies["saved-password"],
    background: request.cookies["saved-background"],
    currency: currency,
    me: me,
    time: time,
    anti: anti,
    hostname: request.hostname,
    post_number: 0,
    post_list: "",
    comment_number: "",
    comment_list: "",
    role_number: "",
    role_list: "",
    follow_number: "",
    follow_list: "",
    follow_amount: database.community[community].members.length,
    community_number: "",
    community_list: "",
    like_number: "",
    like_list: "",
    status: "",
    post_bar: "",
    comment_bar: "",
    profile_menu: "",
    side_bar: "",
    scripts: "",
    self_avatar:
      "https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    self_link: "/u#login",
    nav: "",
    nav_mobile: "",
    info_data: info_data,
    i: "",
    details: "",
    visible: {
      logged_in: "",
      logged_out: "hidden",
      post_bar: "hidden"
    }
  };
  social(values, database.user, "community");
  custom(values);
  //var get = new main(database, mini,username,null,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar);
  //response.send(get.u());
  var delete_passwords;
  //const data = Object.assign({}, database);
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
    delete_passwords = Object.keys(data.user)[values.i];
    delete data.user[delete_passwords]["password"];
  }
  response.render("page.ejs", { database: data, values: values });
});

app.get("/", function(request, response) {
  var values = {
    username: "empty",
    roles: get_roles(),
    anti: anti,
    background: request.cookies["saved-background"],
    users: Object.keys(database.user),
    communities:Object.keys(database.community),
    like_number: 0,
    like_list: 0,
    status: "",
    post_bar: "",
    comment_bar: "",
    profile_menu: "",
    side_bar: "",
    scripts: "",
    self_avatar:
      "https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    self_link: "/u#login",
    nav: `<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="simple-border simple-padding" style="width:20vw;" placeholder="Find User"></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`,
    nav_mobile: "",
    info_data: info_data,
    visible: {},
    changelog:""
  };
  /*
  var i=0;for (i = 0; i < Object.keys(values.roles).length; i++) {
    var role;
    role = Object.keys(values.roles)[i];
    values.roles[role] = JSON.stringify(values.roles[role]).replace(/[,]+/g, ", ").replace(/[["\]]+/g, "");
  }*/
  var me = request.cookies["saved-username"];
  function changelog (number){
    if (number==="last"){number === Object.keys(config.changelog).length-1}
    if (number&&!isNaN(number)){return config.changelog[Object.keys(config.changelog)[number]]}
    else{return config.changelog[Object.keys(config.changelog)[Object.keys(config.changelog).length-1]]}
    
  }
  changelog("last").forEach(add_log)
  function add_log(item,index){
    console.log(item+": "+index)
    if (index > 0){values.changelog+= `- ${item}<br>`}
    else{values.changelog+= `- ${item}`}
  }
  var i=0;for (i = 0; i < Object.keys(get_roles()).length; i++) {
    var role;
    role = Object.keys(values.roles)[i];
    values.roles[role] = ""
    
    var g=0;for (g = 0; g < Object.keys(get_roles()[role]).length; g++) {
    values.roles[role]+= `<a href="/u?search${get_roles()[role][g]}">${get_roles()[role][g]}</a>`
    if (Object.keys(get_roles()[role]).length>0){values.roles[role]+=", "}
  }
    values.roles[role]=function_pack.fix_end(values.roles[role]);
  }
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}

  if (me !== undefined) {
    if (typeof database.user[me] == "undefined") {
      return response.send(msg("No account with this name!"));
    }
    values.self_avatar = database.user[me].avatar;
    values.username = request.cookies["saved-username"];
    values.status = `Logged in as: ${me.toUpperCase()}`;
    values.self = JSON.parse(JSON.stringify(database.user[me]));
  if (values.self){
  if (values.self.password){
    delete values.self.password;
    delete values.self.posts;
    values.self.preferred="Name: "+values.self.preferred}
  }
  }else{values.self = JSON.parse(JSON.stringify(database.user["null"]));}


  custom(values);
  response.render("slash.ejs", { values: values });
});

app.get("/follow-button", cors(), (request, response) => {
  var search = request.query.search;
  if(!search){search = config.owner;}
  var button = `
  <button onclick="location.replace('/connect?method=follow&user=${search}')" class="simple-meown-button" style="vertical-align:middle">
  <span>
  Follow
  </span>
  <link rel="stylesheet" href="https://beta.meown.tk/simple.css">
  </button>`
  response.send(button)
});

app.get('*', function(request, response){
response.redirect("/error?value=4⬡4&text=This%20page%20does%20not%20exist,%20maybe%20head%20back?")
  });

var botname = '⚙️ !v! ittz'
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
var user={};var id = {};
io.on('connection', function (socket) {
  var addedUser = false;
  var curRoomName = 'Lobby';

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: socket.username,
      message: data
    });
  });
  socket.on('private message', function (data) {
    // we tell the client to execute 'new message'
    if (!user[id[data.to]]){
      return socket.emit('new message', {message: "No user with this name :/"});
    }
    if (!database.user[data.from].followers.includes(data.to)&&data.from!==data.to){
      return socket.emit('new message', {message: "This user is not following you!"});
    }
    user[id[data.to]].emit('new message', {
      message: `[PM From ${data.from}]: ${data.message}`,
      type: 'pm',
      from:data.from
    });
    
  });
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    user[socket.id]=socket;
    id[username] = socket.id;
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
      delete user[socket.id]
      delete id[socket.username]
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

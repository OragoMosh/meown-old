// Setup basic express server
const express = require("express"),
      fs = require("fs"),
      cookieParser = require("cookie-parser"),
      bodyParser = require("body-parser"),
      bcrypt = require("bcryptjs"),
      nodemailer = require("nodemailer"),
      path = require('path'),
      formidable = require('formidable'),
      cors = require('cors'),
      fetch = require('node-fetch'),
      {google} = require('googleapis');

var database_location=__dirname+"/database.json",
    database = JSON.parse(fs.readFileSync(database_location)),
    config_location=__dirname+"/config.json",
    config = JSON.parse(fs.readFileSync(config_location)),
    changelogs = config.changelogs||config.changelog||{"Error":["Idk why its not working rn sry"]};

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);


const urlencodedParser = bodyParser.urlencoded({ extended: true });

var port = process.env.PORT || 3232;

var hostname = config.url,
    currency = config.currency,
    projectName = config.name;

var anti = "this.value = this.value.replace(/[^a-z0-9]/i, '')";
//const User = require('./modules/dashboard');
//var Message = require('./modules/tools/msg');
var variablePack = require('../modules/tools/variablepack'),
    functionPack = require('../modules/tools/functionpack'),
    webhook = new require('../modules/tools/webhook');

var logs = {
  views: {},
  changes: {}
};

// Routing
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(express.static(__dirname + "/../public"));
app.use(express.static(__dirname + "/../assets"));
app.use('/tools',express.static(__dirname + "/../modules/tools"));
app.set("view engine", "ejs");

var console_ = [];

function msg(type, part, url, version) {var Message = require('../modules/msg');return new Message(type, part, url, version).value()}

var date = new Date();

var time = variablePack.time;

do_am_pm();

var am_pm;

function do_am_pm() {if (date.getHours() - 4 < 12) {am_pm = "AM";} else if (date.getHours() - 4 > 12) {am_pm = "PM";} else {am_pm = "broken??";}}
function deleteUser(id){
  delete database.user[id];
  var c = database.community
  Object.keys(c).forEach(function (i){
c[i]?.members!==undefined?c[i]=c[i]?.members.filter(i => i !== id):null;
});
}
server.listen(port, function() {
  console.log("Server listening at port %d", port);
  console.log(
    `Time: ${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours() - 4}:${date.getMinutes()}:${date.getSeconds()} ${am_pm}`
  );
 /* var webhookMessage = {
    "embeds":[
      {
        author: {
          name: 'Meown',url: 'https://meown.ml/',icon_url: config.logo,
        },
        thumbnail: {url:config.logo},
        description: 'Meown is now online!',
        footer: {
	      	text: 'Made with Meown API',
	      	icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',
	      }
      },
    ]
  }
  webhook.config = Object.assign({}, config.webhook, webhookMessage);
webhook.send()
*/
});
var fake_user = {
      "password": "$2a$10$w49HxOAv6PN5HSpexhNu1OUNrohjJeEoBTta7dsqp4EtX1RPTZy36",
      "email": "",
      "coins": 0,
      "preferred": "Guest account",
      "background": "https://convertingcolors.com/plain-2C2F33.svg",
      "banner": "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      "description": "lol",
      "avatar": "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png",
      "creation_date": "1603731256000",
      "communities": [],
      "roles": [],
      "followers":[],
      "following":[],
      "xp": 0
    };

setInterval(function(){ 
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  console.log(`Saving Database on bot server!`);
}, 180000);

function real_user(username,password,debug){
  if(!database.user[username]){
    if(debug===true) {console.log("User with this username does not exist.");}
    return false;
    
  }
  else
    
  if(!bcrypt.compareSync(password,database.user[username].password)){
    if(debug===true) {console.log("Incorrect username or password.");}
    return false;
  }
  else return true;
}


function exists_user(username,debug){
  if(!database.user[username]){
    return false;
    if(debug===true) {console.log("User with this username does not exist.");}
  }
  
  else return true;
  
}
async function mail(to, subject, text, html) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'themittzcat@gmail.com', // generated ethereal user
      pass: process.env.mailPassword // generated ethereal password
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

//app.get("/data", (request, response) => {response.render("database", { qs: request.query });});

app.post("/result", urlencodedParser, (request, response) => {
  console.log(request.body);
  if (request.body.sentpass.toLowerCase() == config.passcode) response.send(JSON.stringify(database, null, 2));
  else response.send("<br>Password sent: " +request.body.sentpass.toLowerCase() +"<br>Status: Failed");
});

app.get("/manifest", (request, response) => {
  var link = request.query.url||"/";
  var manifest = {
  "dir": "ltr",
  "lang": "EN",
  "background_color": "#cb3837",
  "theme_color": "#9a1d1d",
  "description": "A social media that can..",
  "display": "fullscreen",
  "categories": ["social","media","meown"],
  "name": "Meown",
  "short_name": "Meown",
  "orientation": "portrait-primary",
  "start_url": "/",
  "scope":"/",
  "related_applications": [
  ],
  "prefer_related_applications": false,
  "icons": [
    {
      "src": "https://raw.githubusercontent.com/Orago/mittens/master/assets/images/boxie-x192-big.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
  
}
  return response.json(manifest)
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
  <input type="text" id="username" name="sentname" placeholder="Username" required/>
  <input type="password" id="password" name="sentpass" placeholder="Password" required/>
  <b onclick="Toggle();document.getElementById('password').type==='password' ? this.innerText='Show Password' : this.innerText='Hide Password';">Show Password</b>
  <script>
  function Toggle() { 
      var temp = document.getElementById("password");
      temp.type==='password' ? temp.type = "text" :  temp.type = "password";
  } 
  </script>
  <style>.container>div .togglePassword {display: block;height: 40px;text-align: left;padding-left: 80%;padding-top: 5px;font: 22px sans-serif;position: relative;top: 0;left: 0;}.container>div .togglePassword>i {position: absolute;bottom: 57px;cursor: pointer}</style>
  `
  }
  return values;
  }
}else 
  if (type === "register"){
    var values ={method:"POST",action:"/register",title:`Register`,button:"Create account!",body:`Welcome to ${projectName} if your are new please create an account with the correct details and then click Create account!`+`<br><br><a href="/login">Login</a> |`,
    fields:`<input type="text" name="sentname" placeholder="Username" required/><input type="text" name="sentdesc" placeholder="Description" required/><input type="password" name="sentpass" placeholder="Password" required/><input type="password" name="sentpassconfirm" placeholder="Password Confirm" required/><input type="email" name="sentemail" placeholder="Email" required/><br>
    By continuing you agree to the <a href="/terms">Terms and Service</a>`
  }
  return values;
}
  
}
app.get("/terms", (request, response) => {
  return response.render("terms");
});

app.get("/login", (request, response) => {
  return response.render("login");
});

app.get("/register", (request, response) => {
  return response.render("login");
});

app.get("/dashboard", (request, response) => {
  var me = request.cookies["saved-username"],
      password = request.cookies["saved-password"];
  if (!me) return response.send(msg("notLogged", "Username", "/u"));
  
  var values = {
    database: database,username: me,currency: currency,
    followers: database.user[me].followers,recent_followers: "",follows: database.user[me].following,recent_follows: "",
    changes: logs.changes[me],recent_changes: "",reports:"database.mini.reports.glitches[me]",
    recent_reports: "",last: 3,i: "",
    views: "",forms: "",staff:false
  };
if (database.user[me].roles.includes("developer")||database.user[me].roles.includes("moderator"))values.staff = true;
  
  if (values.changes) {
    values.last = functionPack.max(values.changes.length,2);
    for (values.i = 0; values.i < values.last; values.i++) {
      if (typeof database.user[me] !== "undefined") 
        values.recent_changes += `<li class="simple-padding-16">
        <img src="${database.user[me].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u/${me}">${values.changes[values.i + values.changes.length - values.last]}</a></span><br>
      </li>`;
      
    }
  } else {values.recent_changes = "None";}
  
  if (values.follows !== "") {
    values.last = functionPack.max(values.follows.length,2);
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
    values.last = functionPack.max(values.followers.length,3);
    for (values.i = 0; values.i < values.last; values.i++) {
      if (typeof database.user[values.followers[values.i + values.followers.length - values.last]] !== "undefined") 
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
  } else values.recent_followers = "None";
  if (logs.views[me]) values.views = logs.views[me];
  else values.views = 0;
  var newEl = functionPack.newEl;
  function new_feed(values){
    if (!values.text) {values.text="";}
    if (!values.when) {values.when="";}
    if (!values.text) {values.text="";}
    return newEl({"element":"tr",type:"double",value:
    newEl({"element":"td",type:"double",value:newEl({"element":"i",type:"double",class:`fa fa-${values.icon} simple-text-blue simple-large`})})+
    newEl({"element":"td",type:"double",value:values.text})+newEl({"element":"i",type:"double",value:values.when})
    })
  }
  response.render("dashboard.ejs", { database: database, values: values });
});

app.post("/edit", urlencodedParser, (request, response) => {
  var method = request.body.method,
      me = request.cookies["saved-username"];
  console.log(request.body)
  if (!method){return response.send(msg("missing", "Method", "/u"));}
  if (me == undefined ||!me){return response.send(msg("include", "Username", "/u"));}
  if (typeof database.user[me] == "undefined"){return response.send(msg("noAccount", "Username"));}
  if (!bcrypt.compareSync(request.cookies["saved-password"],database.user[me].password)) return response.send(msg("incorrect", "Username", "/dashboard"));
  
  
  if (method === "details") {
    var text_add = "";
    if (request.body.sentnewpass) {
      database.user[me].password = request.body.sentnewpass;
      text_add += `New Password: ${request.body.sentnewpass}`;
    }
    if (request.body.sentnewdesc){database.user[me].description = request.body.sentnewdesc;}
    if (request.body.sentnewavatar){database.user[me].avatar = request.body.sentnewavatar;}
    
    if (database.user[me].roles.includes("developer") ||database.user[me].roles.includes("moderator")) {
      if (request.body.sentnewbackground){database.user[me].background =request.body.sentnewbackground;}
      if (request.body.sentnewbanner){database.user[me].banner =request.body.sentnewbanner;}
    }
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("edited", "Username", "/u"));
  } else 
    
    if (method === "new-post") {
    if (!request.body.sentposttitle) return response.send(msg("include", "Post Title", "/u"));
    if (!request.body.sentpostbody) return response.send(msg("include", "Post Body", "/u"));
    if (!request.body.sentpostcategory) return response.send(msg("include", "Post Category", "/u"));
    if (!request.body.id) return response.send(msg("include", "ID (user / community)", "/u"));
    if (functionPack.htmlCheck(JSON.stringify(request.body))) {return response.send(msg("custom", "Do not use html!", "/u"));}
      
    var text = "", 
        category= request.body.sentpostcategory,
        id = request.body.id,
        post_type = "user";
      
    if (id !== me&&category==="user"){category="community";id=`null`;}
    //for (let i = 0; i < request.body.sentpostbody.length &&request.body.sentpostbody.includes("!n "); i++) {
    //  request.body.sentpostbody = request.body.sentpostbody.replace("!n ","<br>");
    //}
    if (database[category][id].posts&&database[category][id].posts.includes(request.body.sentposttitle.toLowerCase())){
      return response.send(msg("postExists", null, "/u"));
    }
    if (!database[category][id].posts){
      database[category][id].posts = [];
    }
    var details={
      title: request.body.sentposttitle,
      body: request.body.sentpostbody,
      likes: [],
      comments: [],
      date: Date.now,
    }
    if (category==="community") {details.username = me;}
    database[category][id].posts.push(details);
    //database.user[me].coins += 1;
    //database.user[me].xp += 1;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("postCreated","Username",`/${category[0]}`,`&username=${me}#${database[category][id].posts.length - 1}`));
  } else 
    
    if (method === "delete-post") {
      var category = request.body.category, 
          id = request.body.id,
          deleted_post = {
        "user":{
          "title": "DELETED POST",
          "body": "This post has been deleted by the author or someone with permissions to delete it.",
          "likes": [],"comments": []
        },
         "community":{
          "title": "DELETED POST",
          "body": "This post has been deleted by the author or someone with permissions to delete it.",
          "likes": [],"comments": [],
          "sender": "meown"
        }
      }
      if (!category||category!=="user"&&category!=="community"){return response.send(msg("custom", `Error unknown post category! (${category})`, "/u"))}
      
    if (!database[category][id].posts[request.body.sentnum]) return response.send(msg("post_does_not_exist", "", "/u"));
    
    
    if (category === "user"){
      if (!permission(1,me)&&id!==me) {response.send(`Not Your Post! ${permission(1,me)} !== ${id!==me}`);}
      if (!logs.changes[id]){logs.changes[id] = [];}
      if (logs.changes[id]){logs.changes[id].push(`Post #${request.body.sentnum} Deleted "${database[category][id].posts[request.body.sentnum]}"`);}
      else if (!logs.changes[id]) {logs.changes[id] = [];}
    }
      
      database[category][id].posts.splice(request.body.sentnum,1);
    return response.send(msg("post_deleted","Username",`/u/${id}#${database[category][id].posts.length - 1}`));
  } else 
    
    
    if (method === "redeem") {
    if (typeof config.codes[request.body.sentcode] == "undefined") return response.send(msg("custom", "Invalid Code!", "/dashboard"));
    if (database.user[me].codes.includes(request.body.sentcode)) return response.send(msg("custom", "Code Exists!", "/dashboard"));
    if (logs.changes[me]) logs.changes[me].push(`Code Redeemed: "${request.body.sentcode}" for ${config.codes[request.body.sentcode]} ${currency} `);
    else if (!logs.changes[me]) logs.changes[me] = [];
      
    database.user[me].codes.push(request.body.sentcode);
    database.user[me].coins += config.codes[request.body.sentcode];
    return response.send(msg("custom", "Code Redeemed", "/dashboard"));
  } else 
    
    if (method === "new-post-comment") {
    if (!request.body.sentcomment){return response.send(msg("include", "Comment Value", "/u"));}
    if (!request.body.commentid){return response.send(msg("include", "Comment Id", "/u"));}
    if (database.user[me].posts &&database.user[me].posts[request.body.commentid].comments&&database.user[me].posts[request.body.commentid].comments.includes(request.body.sentcomment.toLowerCase())){return response.send(msg("postExists", null, "/u"));}
    if (!database.user[me].posts){database.user[me].posts = [];}
    if (functionPack.htmlCheck(request.body.sentcomment.toLowerCase())) return response.send(msg("custom","No HTML Plez"));
      
    database.user[me].posts[request.body.commentid].comments.push({ username: me, text: request.body.sentcomment });
    database.user[me].xp += 0.05;
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(msg("postCreated","Username",`/u/${me}#${database.user[me].posts.length - 1}`));
  } 
  else 
    
    
    if (method === "new-community") {
    if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {return response.send(msg("exists", null, "/u"));}
    if (!request.body.sentcommunity) {return response.send(msg("invalid", "Community", "/register"));}
    if (!request.body.sentdesc) {return response.send(msg("invalid", "Description", "/register"));}
      
      var community = request.body.sentcommunity.toLowerCase();
      
    if (typeof database.community[community] === "undefined") {
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
      response.send(msg("custom", "", `/c/${community}`));
    }
  }  else {
    return response.send(msg("missing", "Method lol", "/u"));
  }
});

app.get("/connect/:method?/:id?", urlencodedParser, (request, response) => {
  var method = request.query.method||request.params.method,
      id = request.query.id||request.params.id,
      me = request.cookies["saved-username"]||undefined;
  
  if (me){me = me.toLowerCase();}else return response.send(msg("custom", "Not Logged in", "/u"));
  if (id){id = id.toLowerCase();} else return response.send(msg("missing", "ID", "/u"));
  if (!method){return response.send(msg("missing", "Method", "/"));}
  if (typeof database.user[me] === "undefined") return response.send(msg("noAccount", "Username"));
  if (!bcrypt.compareSync(request.cookies["saved-password"],database.user[me].password)) return response.send(msg("incorrect", "Username", "/dashboard"));
  if (method==="join" && typeof database.community[id] === "undefined") {return response.send(msg("custom", "ERROR", `/c/${id}`));}

  if (method === "follow") {
    if (me === id)return response.send(msg("custom","You cannot follow yourself!"))
    if (!database.user[me].following.includes(id)) {
      database.user[me].following.push(id);
      database.user[id].followers.push(me);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u/${me}&popup=User+Followed!'"/>`);
    } else {
      database.user[me].following = database.user[me].following.filter(item => item !== id);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(
        `<meta http-equiv="Refresh" content="0; url='/u/${
          request.cookies["saved-username"]
        }&popup=User+Unfollowed!'"/>`
      );
    }
  } else if (method === "join") {
    if (!database.user[me].following.includes(id)) {
      database.community[id].members.push(me);
      database.user[me].communities.push(id);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u/${me}&popup=User+Followed!'"/>`);
    } else {
      database.community[id].members = database.community[id].members.filter(item => item !== me);
      database.user[me].communities = database.user[me].communities.filter(item => item !== id);
      fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
      return response.send(`<meta http-equiv="Refresh" content="0; url='/u/${me}&popup=User+Unfollowed!'"/>`);
    }
  }
});

app.post("/login", urlencodedParser, (request, response) => {
  var username = request.body.username,
      password = request.body.password
  if (!username || !password) return response.send(msg("include", "Username and Password", request.path));
  if (typeof database.user[username.toLowerCase()] == "undefined") return response.send(msg("noAccount", null, request.path));
  console.log(`${password} : ${database.user[username.toLowerCase()].password}`)
  if (bcrypt.compareSync(password,database.user[username.toLowerCase()].password)) {
    if (request.cookies["saved-username"] && request.cookies["saved-password"]) {return response.send(msg("loggedIn", "", "/u")); }
    else {
      response.cookie("saved-username", username.toLowerCase(), {maxAge: 1.296e9});
      response.cookie("saved-password", password, {maxAge: 1.296e9});
      return response.send(msg("custom", "Successfuly logged in.", "/u"));
    }
  } else return response.send(msg("incorrect", "Password", request.path));
});

app.get("/logout", urlencodedParser, (request, response) => {
  if (!request.cookies["saved-username"] &&!request.cookies["saved-password"]) return response.send(msg("logged_not",null, "/u")); 
  else {
    response.cookie("saved-username", request.cookies["saved-username"], {maxAge: 0});
    response.cookie("saved-password", request.cookies["saved-password"], {maxAge: 0});
    return response.send(msg("logout",null, "/u"));
  }
});

app.get("/auth/:id?", urlencodedParser, (request, response) => {
  var username = request.cookies["saved-username"],
      password = request.cookies["saved-password"];
  var id = request.params.id.toLowerCase()||request.query.id||undefined;
  if (!id){return response.send("No input given")}
  if (!request.cookies["saved-username"]||!request.cookies["saved-password"]) {return response.send("Not Logged In");}
  if (username !== id) {return response.send("Username Headers don't match.");}
  
  if(!bcrypt.compareSync(password,database.user[username].password)) return response.send("Unsuccessful");
  
  return response.send("Successful")
  
});

app.get("/u-text", urlencodedParser, (request, response) => {
  var username = request.query.search.toLowerCase();
  if (typeof database.user[username] == "undefined") return response.send(msg("noAccount", null, "/u"));
  
  var values = {
    "post_number":0,
    "post_list":"",
    "comment_number":0,
    "comment_list":""
  }

  while (values.post_number < database.user[username].posts.length){
    var num = values.post_number;values.comment_list="";
  while (values.comment_number < database.user[username].posts[num].comments.length){
    var num2 = values.comment_number;var sender = database.user[username].posts[num].comments[num2].username
    if (!database.user[sender])sender = "Deleted User"
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
  if (typeof database.user[request.body.username?.toLowerCase()||"-%$#"] !== "undefined") return response.send(msg("exists", null, "/u"));
  var username = request.body.username,
      description = request.body.description,
      password = request.body.password,
      passwordConfirm = request.body.passwordconfirm,
      email = request.body.email;
  
  if (!username) return response.send(msg("invalid", "Username", "/register"))
  if (!password) return response.send(msg("invalid", "Password", "/register"));
  if (!description) return response.send(msg("invalid", "Description", "/register"));
  if (password !== passwordConfirm) return response.send(msg("match", "password & confirm password", "/register"));
  if (functionPack.a0(username) || functionPack.htmlCheck(description))
    return response.send(msg("custom", "Do not use custom characters or html!", "/u"));
  
  if (typeof database.user[username.toLowerCase()] == "undefined") {
    response.cookie("saved-username", username.toLowerCase(), {maxAge: 1.296e9});
    response.cookie("saved-password", password, {maxAge: 1.296e9});
    database.emails.push(email.toLowerCase());
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    database.user[username.toLowerCase()] = {
      password: hash,
      email: email,
      preferred: username,
      coins: 0,
      xp: 0,
      background: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      banner: "https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
      description: description.toLowerCase(),
      avatar: "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png",
      following: [],
      followers: [],
      communities: [],
      codes: [],
      posts:[],
      roles: [],
      creation_date: Date.now()
    };
    //mail(request.body.sentemail,`Your account, ${request.body.sentname} on ${project_name}`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">${project_name}</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
      var webhookMessage = {
    "embeds":[
        {
          author: {name: 'Meown',url: 'https://meown.ml/',icon_url: config.logo,
          },
          thumbnail: {url:config.logo},
          description: `New user @${username} has joined!`,
          footer: {
	        	text: 'Made with Meown API',
	        	icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',
	        }
        },
    ]
  }
  webhook.config = Object.assign({}, config.webhook, webhookMessage);
webhook.send()
    
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${username.toLowerCase()}&popup=Account+Created!'"/>`);
  }
});

function info_data(x,values) {
  var result=``;
  if (!values){values = {}}
  values.description = `The newest, worst social media.`;
  
  if(values.category && values.category=="user"&&values.username&&database[values.category][values.username])
  {values.description = database[values.category][values.username].description||"No Description";}

  result = `
<title>${projectName} | ${functionPack.caps(x)}</title>
<meta property="og:title" content="${projectName} | ${functionPack.caps(x)}" />
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


<script>
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
      /*navigator.registerProtocolHandler(
    "web+meown",
    "https://meown.ml/custom/%s",
    "Meown"
  );*/
  }
</script>

`;
  if (values&&values.hostname){result+=`<link rel="canonical" href="https://${values.hostname}">`;}
  return result;
}


app.get("/wallet/:id?", urlencodedParser, (request, response) => {
  var id = request.params.id||request.query.id||undefined;
  if (!id){return response.send("No input given");}
  if (!isNaN(id))id=id.toString();
  if(typeof database.wallet[id]==="undefined"){return response.send("Wallet doesn\'t exist");}
  var wallet = database.wallet[id]
  return response.send(`Owner: ${wallet.owner},<br>Admins: ${wallet.admin&&wallet.admin[0]&&wallet.admin||"None"},<br>Coins: ${wallet.amount||0}`);
});


app.get("/api/:method?/:search?", cors(), (request, response) => {
  var search = request.params.search||request.query.search,
      method = request.params.method||request.query.method,
      res = "response";
  
  if (!method) {return response.json({ error: "method" });}
  if (method) {
    if (method === "user") {
      if (!search) return response.json({ status:200, [res]: "name/id/variant" });
      if (typeof database.user[search] == "undefined"){return response.json({status:200, [res]: "id_from_database", "id":search});}
      var user = database.user[search];
      
      const cloneuser = Object.assign({}, user)||"error";
      
      delete cloneuser.password;
      delete cloneuser.email;
      
      if (request.query.includeposts!=="true")delete cloneuser.posts;
      return response.json({status:200,[res]:cloneuser});
    } 
    
    else if (method === "users"){
      var id=Object.keys(database.user);
      var vals = {
        communities:id,
        size:id.length,
        roles:getRoles()
      }
      
      return response.json({status:200,[res]:vals||"error"});
    }
    
    else if (method === "communities"){
      var id=Object.keys(database.community),
          vals = {
        communities:id,
        size:id.length
      }
      return response.json({status:500,[res]:vals||"error"});
    }
    
    if (method === "community") {
      if (!search) return response.json({ error: "name/id/variant" });
      if (typeof database.community[search] == "undefined") return response.json({ error: "community_from_database", "id":search});
      var community = database.community[search]||"error";
    
      const clonecommunity = Object.assign({}, community)||"error";
    
      if (request.query.includeposts!=="true"&&clonecommunity!=="error"){delete clonecommunity.posts;}
      return response.json({status:200,[res]:clonecommunity});
    } 
    
    else if (method === "changelogs") {
      var data = JSON.parse(JSON.stringify(changelogs||"error"))
      return response.json({status:200,[res]:data});
    }
    
    else if (method === "config") {
      var data = JSON.parse(JSON.stringify(config||"error"))
      delete data.passcode;delete data.codes
      return response.json({status:200,[res]:data});
    }
    
    else {
      return response.json({status:500,[res]: "no_results" });
    }
  }
});

function getRoles(users) {
  var roles = {},
      user,
      users = users||database.user;
  for (var i = 0; i < Object.keys(users).length; i++) {
    user = Object.keys(users)[i]; //Get each user details
    for (var i2 = 0; i2 < Object.keys(users[user].roles).length; i2++) {
      //Get each users roles
      if (!roles[users[user].roles[i2]]){roles[users[user].roles[i2]] = [];}
      if (!roles[users[user].roles[i2]].includes(user)) {
        roles[users[user].roles[i2]].push(user);
      }
    }
  }
  return roles;
}

app.get("/error/:text?/:value?", (request, response) => {
    var text = request.query.text||request.params.text||"huh?",
        value = request.query.value||request.params.value||"Well how'd we get here?",
        who = request.query.who,
        symbols=[];

 
    if (who){value[0]=who+" ";}
    for (var i = 0; i < text.length; i++) {
      var overlay="",emoji_letters = ["U","u","O","o","D","n"]
      if (emoji_letters.includes(text.charAt(i)))overlay="🐈";
      symbols.push({"symbol":text.charAt(i),"overlay":overlay})
    }
  
  var values = {
    "error":{
      "code":symbols,
      "buttons":[{"url":"window.history.back();","text":"Back"},{"url":"location.replace('/');","text":"Homepage"}],
      "text":value,
      "type":text
    }
  };
  values.error.buttons.push(request.query.requestUrl?{"url":`location.replace('${request.query.requestUrl}');`,"text":`Reload ${request.query.requestUrl}`}:undefined)
  
  values.error = JSON.stringify(values.error);
  
  response.render("error.ejs", values);
});

app.get("/u/:search?", (request, response) => {
  var me = request.cookies["saved-username"],
      username = request.params.search||request.query.search||me||null;

  
  function banned(type,who) {response.redirect(`/error?value=${type}&text=@${who} is ${type} Lol`)}
  
  if (!username) response.send(msg("noAccount", null, "/login")); //If not username
  
  if (typeof database.user[username] === "undefined") return response.send(msg("noAccount", null, "/u")); //If user exists in database
  if (database.user[username].roles.includes("banned")){banned("BANNED",username);}
  if (database.user[username].roles.includes("suspended")){banned("SUSPENDED",username);}
  
  var values = {
    username: username,
    id: username,
    category: "user",
    background: request.cookies["saved-background"],
    password: request.cookies["saved-password"],
    currency: currency,
    me: me,
    time: time,
    anti: anti,
    hostname: request.hostname,
    visible: {
      postBar:"simple-hidden",
      loggedIn:"simple-hidden"
    }
  };
  values.header=info_data(`${values.category}: `+functionPack.caps(values.username||"")||values.username,{category:values.category,username:values.username});
  
  if (!logs.views[values.id]) logs.views[values.id] = 0;
  
  logs.views[values.id] += 1;
  
  //var Page = require('../modules/page');new Page(values, database).value();
  

  app.locals.title = 'My App'
  response.render("page.ejs", { values: values });
});


function maintenance_check(){
  if (config.maintenance){
    if (config.maintenance === true) {return {"status":true,"url":"/error?value=${type}&text=The server is undergoing maintenance"};}
    else return {"status":false};
  }
  else return {"status":false};
}

app.get("/cold/:search?", (request, response) => {
  if (maintenance_check().status) {return response.redirect();}
  
  var community = request.params.search||request.query.search||"meown",
      me = request.cookies["saved-username"];
  
  if (typeof database.community[community]  === "undefined") {return response.send(msg("custom", "No community with this name", `/c/meown`));}
  
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
    visible: {
      post_bar: "simple-hidden",
      logged_in: "simple-hidden"
    }
  };
  values.header=info_data(`${values.category}: `+functionPack.caps(values.username));
  
  var Page = require('../modules/page');new Page(values, database).value();
  
  
  const data = JSON.parse(JSON.stringify(database));
  
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
    var delete_passwords = Object.keys(data.user)[values.i];
    delete data.user[delete_passwords]["password"];
  }
  response.render("page.ejs", { database: data, values: values });
});

app.get("/c/:search?", (request, response) => {
  if (maintenance_check().status) {response.redirect();}
  
  var community = request.params.search||request.query.search||"meown",
      me = request.cookies["saved-username"];
  
  if (typeof database.community[community]  === "undefined") return response.send(msg("custom", "No community with this name", `/c/meown`));
  
  var values = {
    username: community,
    id: community,
    category: "community",
    data_type: database.community,
    password: request.cookies["saved-password"],
    me: me,
    hostname: request.hostname,
    visible: {
      post_bar: "simple-hidden",
      logged_in: "simple-hidden"
    }
  };
  values.header = info_data(`${values.category}: `+functionPack.caps(values.username));
  
  const data = JSON.parse(JSON.stringify(database));
  for (var i = 0; i < Object.keys(data.user).length; i++) {
    var delete_passwords = Object.keys(data.user)[i];
    delete data.user[delete_passwords]["password"];
  }
  response.render("community.ejs", { database: data, values: values });
});

app.get("/", (request, response) => {
  var me = request.cookies["saved-username"];
  var values = {
    username: "empty",
    self_avatar: "https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    self_link: "/u#login",
    infoData: info_data,
    visible: {},
    changelog:""
  };

  if (me !== undefined) {
    if (typeof database.user[me] == "undefined") {
      return response.send(msg("custom","No account with this name!","/logout"));
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
  return response.render("slash.ejs", { values: values });
});

app.get("/salt/:value?", (request, response) => {
  var value = request.params.value,respond="";
  if (!value) return response.send("No input value");
  return response.send(bcrypt.hashSync(value, bcrypt.genSaltSync(10)))
});

app.get("/chat", (request, response) => {
  return response.render("chat");
});

app.get("/changelogs/:page?", (request, response) => {
  var page = request.params.page||request.query.page||"last",
      result = `
  <html>
  <a id="changelogs">0</a>
  </html>
          <script>
  async function MeownApi(input){
  var options=options||""
  var response = await fetch(\`/api/\${input}\`).then(l => l.json()).then(l => l.response)
  return response;
  }
  function caps(text){return text.charAt(0).toUpperCase() + text.slice(1);}
  
          window.addEventListener("load", async function () {

                var changelogs = await MeownApi("changelogs").then((values)=>{return values}),result=\`<b>Changelogs:</b><br>\${changelog("${page}").name}<br>\`;
  function changelog (number){
    number==="${page}"?number === Object.keys(changelogs).length-1:number=number;
    if (number&&!isNaN(number)){return {name:caps(Object.keys(changelogs)[number]),values:changelogs[Object.keys(changelogs)[number]]}}
    else return {name:caps(Object.keys(changelogs)[Object.keys(changelogs).length-1]),values:changelogs[Object.keys(changelogs)[Object.keys(changelogs).length-1]]};
  }
  changelog("${page}").values.forEach(add_log);
  function add_log(item,index){
    if (index >= 0) {result+= \`- \${item}<br>\`;}
    else {result+= \`- \${item}\`;}
  }
  document.getElementById("changelogs").innerHTML=result;
  })();
          </script> 
`
  return response.send(result);
});

app.get("/about/", (request, response) => {
  var me = request.cookies["saved-username"]||"guest";

  function banned(type,who){response.redirect(`/error?value=${type}&text=@${who} is ${type} Lol`);/*I dunno lol*/}
  
  if (typeof database.user[me] === "undefined") return response.send(msg("custom", "Not logged in","/"));
 
  var values = {
    category: "user",
    background: request.cookies["saved-background"],
    password: request.cookies["saved-password"],
    currency: currency,
    me: me,
    id:me,
    time: time,
    anti: anti,
    hostname: request.hostname,
    visible: {
      postBar:"simple-hidden",
      loggedIn:"simple-hidden"
    }
  };
  values.header=info_data(`About`);
  
  if (!logs.views[values.id]) logs.views[values.id] = 0;
  
  logs.views[values.id] += 1;
  
  const data = {
    user:{
      [me]:JSON.parse(JSON.stringify(database[values.category][me]))
    }
  }
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
    var delete_passwords = Object.keys(data.user)[values.i];
    delete data.user[delete_passwords]["password"];
  }
  response.render("social.ejs", { database: data, values: values });
});

app.get("/follow-button/:search?", (request, response) => {
  var search = request.params.search||"orago",
      result,url,username = search.toLowerCase();
  if(!search){
    if (request.query.search) search = request.query.search;
    else search = config.owner;
  }
  if (typeof database.user[username]  !== "undefined"){
    result = `Follow @${search}`; url = `/connect?method=follow&user=${username}`;}
  else{result = `Invalid User`; url = `u`;}
  
  var button = `
  <button onclick="location.replace('${url}')" class="simple-meown-button" style="vertical-align:middle">
  <span>
  Meown | ${result}
  </span>
  <link rel="stylesheet" href="https://beta.meown.tk/simple.css">
  </button>
  `;
  
  return response.send(button)
});



function staff_check(username){
  if (getRoles().owner.includes(username))return config.role_info["owner"].permission;
  else if (getRoles().developer.includes(username))return config.role_info["developer"].permission;
  else if (getRoles().moderator.includes(username))return config.role_info["moderator"].permission;
  else if (getRoles().helper.includes(username))return config.role_info["helper"].permission;
}

function permission(num,who){
  if(!who){who = "guest";}
  return num >=staff_check(who);
}

app.post("/command", urlencodedParser, (request, response) => {
var command_values = request.body.command.split(" "),
    command = command_values[0],
    target = command_values[1]||"",
    value = command_values[2]||"";
  
  if (functionPack.htmlCheck(JSON.stringify(command_values))) return response.send(msg("custom",`Bro.. No Html.`,"/dashboard"));
  
var username=request.cookies["saved-username"],
    password = request.cookies["saved-password"]||"Lol";
  
if (!real_user(username,password)) return response.send(msg("custom",`Invalid Username / Password`,"/dashboard"));
  
if (command==="ban"&&permission(1,username)){
  if (!database.user[target]||username===target) return response.send(msg("custom",`User Doesn't Exist`,"/dashboard"));
  database.user[target].roles.push("banned")
    var webhookMessage = {
    "embeds":[
        {
          author: {name: 'Meown',url: 'https://meown.ml/',icon_url: config.logo,},
          thumbnail: {url:config.logo},
          description: `The ban hammer has struck @${target}!`,
          footer: {text: 'Made with Meown API',icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',}
        },
    ]
  }
  webhook.config = Object.assign({}, config.webhook, webhookMessage);webhook.send();
 return response.send(msg("custom",`@${target} is banned`,"/dashboard"));
}
else if (command==="unban"&&permission(1,username)){
  if (!database.user[target]||username===target){
    return response.send(msg("custom",`User Doesn't Exist`,"/dashboard"));
  }
  if (database.user[target].roles.includes("banned")){
    database.user[target].roles = database.user[target].roles.filter((n) => {return n != "banned"});
        var webhookMessage = {"embeds":[{author: {name: 'Meown',url: 'https://meown.ml/',icon_url: config.logo,},thumbnail: {url:config.logo},description: `@${target} has been unbanned, welcome them back or something!`,footer: {text: 'Made with Meown API',icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',}},]}
  webhook.config = Object.assign({}, config.webhook, webhookMessage);webhook.send();
    return response.send(msg("custom",`User Unbanned`,"/dashboard"));
  }
  else if (database.user[target].roles.includes("suspended")){
    database.user[target].roles = database.user[target].roles.filter((n) => {return n != "suspended"});
        var webhookMessage = {"embeds":[{author: {name: 'Meown',url: 'https://meown.ml/',icon_url: config.logo,},thumbnail: {url:config.logo},description: `@${target} has been unsuspended somehow, go give them a hug.`,footer: {text: 'Made with Meown API',icon_url: 'https://cdn.glitch.com/0322d62f-81b5-4f06-9b33-557687636cec%2Fboxie-512px.png',}},]}
  webhook.config = Object.assign({}, config.webhook, webhookMessage);webhook.send();
    return response.send(msg("custom",`User UnSuspended`,"/dashboard"));
  }
  else return response.send(msg("custom",`User is not banned`,"/dashboard"));
  return response.send(msg("custom",`@${target} is banned`,"/dashboard"));
}
  
else if (command==="add-coin"&&permission(1,username)){
  if (!database.user[target]) return response.send(msg("custom",`User Doesn't Exist!`,"/dashboard"));
  if (isNaN(value))return response.send(msg("custom",`Not A number`,"/dashboard"));
  database.user[target].coins += Number(value);
 return response.send(msg("custom",`Added ${value} coins to @${target}`,`/u/${target}`));
}
  
else if (command==="set-coin"&&permission(1,username)){
  if (!database.user[target]) return response.send(msg("custom",`User Doesn't Exist!`,"/dashboard"));
  if (isNaN(value))return response.send(msg("custom",`Not A number`,"/dashboard"));
  database.user[target].coins = Number(value);
 return response.send(msg("custom",`Set @${target}\'s coins to ${value}`,`/u/${target}`));
}
  
else if (command==="delete-user"&&permission(1,username)){
  if (!database.user[target]) return response.send(msg("custom",`User Doesn't Exist!`,"/dashboard"));
  deleteUser(target);
  
 return response.send(msg("custom",`@${target} is no more. (They have been deleted)`));
}

else if (command==="rename-user"&&permission(1,username)){
  if (!database.user[target]) return response.send(msg("custom",`User Doesn't Exist!`,"/dashboard"));
  if (database.user[value]) return response.send(msg("custom",`The New Username Already Exists.`,"/dashboard"));
  if (functionPack.a0(value)) return response.send(msg("custom", "Do Not Use Custom Characters For A Username!", "/dashboard"));
  database.user[value] = database.user[target];
  delete database.user[target];
 return response.send(msg("custom",`@${target} is now @${value}!`,`/u/${value}`));
}
  
else if (command==="set-nick"&&permission(1,username)){
  if (!database.user[target]) return response.send(msg("custom",`User Doesn't Exist!`,"/dashboard"));
  if (database.user[value]) return response.send(msg("custom",`The New Username Already Exists.`,"/dashboard"));
  if (functionPack.a0(value)) return response.send(msg("custom", "Do Not Use Custom Characters For A Username!", "/dashboard"));
  database.user[target].preferred = value;
 return response.send(msg("custom",`@${target}'s Nickname' is now @${value}!`,`/u/${value}`));
}
  
else if (command==="create-user"&&permission(1,username)){
  if (database.user[target]) return response.send(msg("custom",`User Already Exists!`,"/dashboard"));
  if (functionPack.a0(target)) return response.send(msg("custom", "Do Not Use Custom Characters For A Username!", "/dashboard"));
  database.user[target] = fake_user;
  database.user[target].preferred = `[>_]-${target}`;
  database.user[target].description = `Command Created User @${target}`;
 return response.send(msg("custom",`@${target} is now @${value}!`,`/u/${target}`));
}
  
else {return response.send(msg("custom",`Invalid Command or Error`,"/dashboard"));}
});



app.get('*', function(request, response){
response.redirect(`/error/4⬡4/This page does not exist, maybe head back?requestUrl=${request.path}`)
});




var botName = '⚙️ MEOWN'
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

var 
  chat = {
    room:{},
    curRoomList:{},
    user:{},
    userList:[],
    prefix:"$"
  },
  templates = {
    room: { users: [] }
  },
    id = {};

var user = chat.user;
var room = chat.room;

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
    
    chat.userList.push(id[username]);
    
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
      
      delete user[socket.id];
      delete id[socket.username];
      if (room[room]&&room[room].users){
        room[room].users = room[room].users.filter(i => i !== socket.username)
      }
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

  socket.on('join room', function (room){
    if ( room !== "lobby" && room !== "Lobby" ) 
      room = "public-"+room
    joinRoom(room);
  });
  
    socket.on('join dm', function (data) {
      // we tell the client to execute 'new message'
      if (!user[id[data.to]]){
        return socket.emit('new message', {message: "No user with this name :/"});
      }
      if (data.to == data.from){
        return socket.emit('new message', {message: "why u talkin to yourself?"});
      } 
      if (!database.user[data.from].followers.includes(data.to)){
        return socket.emit('new message', {message: "This user is not following you!"});
      }
      
      var dm = [data.to,data.from].sort();
      joinRoom(`dm-${dm[0]}-${dm[1]}`);
      user[id[data.to]].emit('new message', {
        message: `[PM From ${botName}]: You have been invited to a dm by ${data.from}\n Use '${chat.prefix}dm ${data.from}' to join`,
        type: 'pm',
        from:data.from
      });
      return socket.emit('new message', {message: `You joined a private dm with ${dm[1]}!`});
    });
  
  
  function joinRoom(room) {
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

      if (chat.room[curRoomName]?.user && chat.room[curRoomName].users.includes(socket.username)){
      chat.room[curRoomName].users = chat.room[curRoomName].users.filter(i => i !== socket.username)
      }
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

        chat.room[room] = templates.room;
        chat.room[room].users.push(socket.username);
        socket.emit('join left result', {
          username: 'you ',
          logAction: logCreate,
          logLocation: logRoom,
          roomName: '「' + room + '」'
        });
      } else {
        ++curRoomList[room];
        room[room].users.push(socket.username);
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
  }
  
});

// Check if roomName is in roomList Object.
function isRoomExist (roomName, roomList) {
  return roomList[roomName] >= 0;
}
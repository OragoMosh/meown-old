// Setup basic express server
const express = require('express');
const fs = require("fs");
const Canvas = require('canvas');
var cookieParser = require('cookie-parser');
const database_location = __dirname+"/database.json";
const mini_location = __dirname+"/mini.json"
const database = JSON.parse(fs.readFileSync(database_location));
const mini = JSON.parse(fs.readFileSync(mini_location));
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const bodyParser = require("body-parser");
const config = require('../config.json');
const urlencodedParser = bodyParser.urlencoded({ extended: true });
const bcrypt= require("bcryptjs");
const nodemailer = require("nodemailer");
var cartoonavatar = require('cartoon-avatar');
const dashboard = require('./html/dashboard');
const main = require('./html/main');
var port = process.env.PORT || 3232;
var hostname = config.url; // replace with the web domain you are currently using Ex. google.com which will then be a variable to added to https:// HOSTNAME then whatever redirect it's supposed to be
var currency = "Coins";
var botname = '⚙️ !v! ittz';
var prefix = '$';
var anti="this.value = this.value.replace(/[&*<>@!#$%^(){}|\\\\/,.\`~]/g, '')"
var logs = {
views:{
  
      },
changes:{}
}
var no_account_message = `🔏 **Whoops!** There is no such user with this name!<br><br>
<button onclick="location.replace('/register')">Register an account.</button>`;
msg('include','Password','u')
function msg(type,part,url,version){
  var text;
  if (!part){part='ERROR'};
    if (!url){url='u'};
  if (!type){type='include'};
  if (!version){version='redirect'};
  if (type==='custom'){text=`${part}`;} else
  if (type==='invalid'){text=`Invalid input "${part}"`;} else
  if (type==='missing'){text=`Missing input "${part}"`;} else
  if (type==='include'){text=`Please make sure to include your ${part}`;} else
  if (type==='no_account'){text=`There is no user with this name.`}else
  if (type==='exists'){text=`A user with this name already exists!`}else
  if (type==='not_logged'){text=`You are not logged in!!`}else
  if (type==='logged_in'){text=`You are already logged in!`}else
  if (type==='logout'){text=`You have logged out!`}else
  if (type==='post_created'){text=`Your Post has been created!`}else
  if (type==='post_exists'){text=`This post already exists!`}else
  if (type==='post_does_not_exist'){text=`This post doesn't exist!`}else
  if (type==='post_deleted'){text=`Your post has been deleted!`}else
  if (type==='edited'){text=`Your account has been edited!`}else
  if (type==='incorrect'){text=`Incorrect Password given.`}else
  if (type==='followed'){text=`Your account has been edited!`}else
  if (type==='unfolloed'){text=`Incorrect Password given.`}else
    {text=`Invalid/Empty Input '${part}'`};
  //return `Invalid/Empty Input '${part}'<br><button onclick=location.replace('https://'+window.location.hostname+'/${url}')>Back</button>`;
  if (version==='button'){return `${text}<br><button onclick=location.replace('https://'+window.location.hostname+'/${url}')>Back</button>`}else
  if (version==='redirect'){return `<meta http-equiv="Refresh" content="0; url='/${url}?notification=${text}'"/>`}else
  return `<meta http-equiv="Refresh" content="0; url='/${url}?notification=${text}'"/>`;
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

async function mail(to,subject,text,html) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    requireTLS:true,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'themittzcat@gmail.com', // generated ethereal user
      pass: '1212004Drago', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Meown No-reply" <themittzcat@gmail.com>', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//mail(to,subject,text,html).catch(console.error);





app.get("/data", (request, response) => {response.render('database', {qs: request.query});});

app.post("/result", urlencodedParser, (request, response) => {
  console.log(request.body)
  if ((request.body.sentpass).toLowerCase()==database.passcode){
    response.send(JSON.stringify(database, null, 2))
  }
  else {response.send("<br>Password sent: "+(request.body.sentpass).toLowerCase()+"<br>Status: Failed")}
});

app.get("/dash", (request, response) => {response.render('dashboard', {qs: request.query});});
app.get("/user", (request, response) => {response.render('user', {qs: request.query});});
app.get("/dashboard", (request, response) => {
  if (!request.cookies['saved-username']){return response.send(msg('not_logged','Username','u'))}
  if (!bcrypt.compareSync(request.cookies['saved-password'],database.user[request.cookies['saved-username']].password)){return response.send(msg('incorrect','Username','u'))}

var followers,follows, recent_followers, recent_follows,last, i,views,changes,recent_changes,forms;
followers = database.user[request.cookies['saved-username']].followers;
follows = database.user[request.cookies['saved-username']].following;
changes=logs.changes[request.cookies['saved-username']];
recent_followers="";recent_follows="";recent_changes=forms="";
last=3;
forms+=`
<form method="post" action="/edit">
    <div class="row">
      <a style="font-size: 1.5em;">Change account info</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="method" value="details"><br>
        <input type="text" name="sentnewpass" placeholder="New password (optional)" style="width:80vw;"><br>
        <input type="text" name="sentnewdesc" placeholder="Change description (optional)" style="width:80vw;"><br>
        <input type="text" name="sentnewavatar" placeholder="Change avatar (optional)" style="width:80vw;"><br>
`;
if(database.user[request.cookies['saved-username']].badges.includes("developer")||database.user[request.cookies['saved-username']].badges.includes("moderator")){
  forms+=`
<input type="text" name="sentnewbackground" placeholder="Change Background (optional)" style="width:80vw;"><br>
<input type="text" name="sentnewbanner" placeholder="Change Banner (optional)" style="width:80vw;"><br>
`
}
forms+=`
        <input type="submit" value="Submit">
      </div>
    </div>
  </form>
<form method="post" action="/edit" >
    <div class="row">
      <a style="font-size: 1.5em;">New Post</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="sentname" value="${request.cookies['saved-username']}">
        <input type="hidden" name="sentpass" value="${request.cookies['saved-username']}">
        <input type="hidden" name="method" value="new-post">
        <input type="text" name="sentpost" class="simple-border simple-padding" placeholder="Post Input"></input>
        <input type="submit" value="Submit">
      </div>
    </div>
  </form>
  <form method="post" action="/edit" >
    <div class="row">
      <a style="font-size: 1.5em;">Delete Post</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="method" value="delete-post">
        <input type="hidden" name="sentname" value="${request.cookies['saved-username']}">
        <input type="hidden" name="sentpass" value="${request.cookies['saved-username']}">
        <input type="number" name="sentnum" placeholder="Post number" min="0" max="1000" required>
        <input type="submit" value="Submit">
      </div>
    </div>
  </form>
  `
forms+=`
  
<form method="post" action="/edit" >
    <div class="row">
      <a style="font-size: 1.5em;">New Community</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="method" value="new-community">
        <input type="text" name="sentcommunity" class="simple-border simple-padding" style="width:200px;" placeholder="Username" minlength="3" maxlength="15" onkeyup="${anti}" required>
        <input type="text" name="sentdesc" class="simple-border simple-padding" style="width:200px;" placeholder="Description"required>
        <input type="submit" value="Submit">
      </div>
    </div>
  </form>
  `
if (changes){
if (changes.length<3){last=2}if (changes.length<2){last=1}if (changes.length<1){last=0}
for (i = 0; i < last; i++) {
  recent_changes += `<li class="simple-padding-16">
        <img src="${database.user[request.cookies['saved-username']].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${request.cookies['saved-username']}">${changes[i+changes.length-last]}</a></span><br>
      </li>`;}
}else{recent_changes="None"}
if (follows!==""){
if (follows.length<3){last=2}if (follows.length<2){last=1}if (follows.length<1){last=0}
for (i = 0; i < last; i++) {
  
  recent_follows += `<li class="simple-padding-16">
        <img src="${database.user[follows[i+follows.length-last]].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${follows[i+follows.length-last]}">${follows[i+follows.length-last]}</a></span><br>
      </li>`;}
}else{recent_follows="None"}
  if (followers!==""){
if (followers.length>=3){last=3}if (followers.length<3){last=2}if (followers.length<2){last=1}if (followers.length<1){last=0}
for (i = 0; i < last; i++) {
  recent_followers += `<div class="simple-row">
      <div class="simple-col m2 text-center">
        <img class="simple-circle" src="${database.user[followers[i+followers.length-last]].avatar}" style="width:96px;height:96px">
      </div>
      <div class="simple-col m10 simple-container">
        <h4>${followers[i+followers.length-last]} <span class="simple-opacity simple-medium">Follower #${i+followers.length-last}</span></h4>
        <!--<p></p>--><br>
      </div>
    </div>`;}
  }else{recent_followers ="None"}
  var username= request.cookies['saved-username'];
if (!logs.views[request.cookies['saved-username']]){views=0};
if (logs.views[request.cookies['saved-username']]){views=logs.views[request.cookies['saved-username']]};
  var get = new dashboard(database, mini,username,currency,views,forms,recent_follows,recent_followers,recent_changes);
response.send(get.html());
  
});


app.post("/edit", urlencodedParser, (request, response) => {
  var method = request.body.method;
  if (!method){return response.send(msg('missing','Method','u'));}
  if(request.cookies['saved-username']==undefined||!request.cookies['saved-username']){return response.send(msg('include','Username','u'));}
  var username = request.cookies['saved-username'];
  if (typeof database.user[username] == "undefined") {return response.send(msg('no_account','Username',''));}
  if (!bcrypt.compareSync(request.cookies['saved-password'],database.user[request.cookies['saved-username']].password)){return response.send(msg('incorrect','Username','dashboard'));}
  
  if (method==="details"){
  var text_add='';
  if(request.body.sentnewpass){database.user[request.cookies['saved-username']].password=request.body.sentnewpass;text_add+=`New Password: ${request.body.sentnewpass}`}
  if(request.body.sentnewdesc){database.user[request.cookies['saved-username']].description=request.body.sentnewdesc;}
  if(request.body.sentnewavatar){database.user[request.cookies['saved-username']].avatar=request.body.sentnewavatar;}
  if(database.user[request.cookies['saved-username']].badges.includes("developer")||database.user[request.cookies['saved-username']].badges.includes("moderator")){
  if(request.body.sentnewbackground){database.user[request.cookies['saved-username']].background=request.body.sentnewbackground;}
  if(request.body.sentnewbanner){database.user[request.cookies['saved-username']].banner=request.body.sentnewbanner;}
  }
  //console.log(`${request.body.sentnewdesc.toLowerCase()}:${request.body.sentnewpass.toLowerCase()}:${request.body.sentnewavatar.toLowerCase()}`)
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  
  return response.send(msg('edited','Username','u'));
  }else
    
    if (method==="new-post"){
      if(!request.body.sentposttitle){return response.send(msg('include','Post Value','u'));}
      if(!request.body.sentpostbody){return response.send(msg('include','Post Value','u'));}

      if(/<\s*[^>]*>/g.test(request.body.sentposttitle)||/<\s*[^>]*>/g.test(request.body.sentpostbody)) 
        {return response.send(msg('custom','Do not use html!','u'));}

if(mini.posts[request.cookies['saved-username']]){
  if(mini.posts[request.cookies['saved-username']].includes((request.body.sentposttitle).toLowerCase())){return response.send(msg('post_exists','','u'));}
  }
  if (!mini.posts[request.cookies['saved-username']]){mini.posts[request.cookies['saved-username']]=[]}
  mini.posts[request.cookies['saved-username']].push({"title":request.body.sentposttitle,"body":request.body.sentpostbody,"likes":[],"comments":[]});
    database.user[request.cookies['saved-username']].coins+=1;
  database.user[request.cookies['saved-username']].xp+=1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`u?username=${request.cookies['saved-username']}#${mini.posts[request.cookies['saved-username']].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="like"){
      var type;var check;
      if (!mini.posts[request.cookies['saved-username']]){response.send(msg('missing','Post??!!','u'))}
      if(!request.body.sentid){return response.send(msg('include','Post Value','u'));}
      if(!request.body.type){return response.send(msg('include','Type','u'));}else{type=request.body.type}
      if (type==="post"){check=mini.posts[username][request.body.sentid]}else
        if (type==="thread"){check=mini.thread[request.body.community][request.body.sentid]}else {response.send(msg('custom','Error??!!','u'))}
      console.log(check);
    if(!check.likes.includes(username)){
      check.likes.push(username);
  //database.user[(request.query.sentname).toLowerCase()].coins+=0.1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${username}&notification=User+Followed!'"/>`);
  } else {
    check.likes=check.likes.filter(item => item !== username);
    fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
    return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${username}&notification=User+Unfollowed!'"/>`);
  }
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`u?username=${username}#${mini.posts[username].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="new-thread"){
      //var re = ;
if(!request.body.sentcommunity){return response.send(msg('include','Comment Value','u'));}
      var community = request.body.sentcommunity;
      if(!request.body.sentposttitle){return response.send(msg('include','Post Value','u'));}
      if(!request.body.sentpostbody){return response.send(msg('include','Post Value','u'));}

      if(/<\s*[^>]*>/g.test(request.body.sentposttitle)||/<\s*[^>]*>/g.test(request.body.sentpostbody)) 
        {return response.send(msg('custom','Do not use html!','u'));}

if(mini.thread[community]){
  if(mini.thread[community].includes((request.body.sentposttitle).toLowerCase())){return response.send(msg('post_exists','','u'));}
  }
  if (!mini.thread[community]){mini.thread[community]=[]}
  mini.thread[community].push({"title":request.body.sentposttitle,"body":request.body.sentpostbody,"likes":[],"comments":[]});
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`c?search=${community}#${mini.thread[community].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="delete-post"){
      if (!mini.posts[request.cookies['saved-username']][request.body.sentnum]){return response.send(msg('post_does_not_exist','','u'));}
  mini.posts[request.cookies['saved-username']].splice(request.body.sentnum, 1);
  if (!logs.changes[request.cookies['saved-username']]){logs.changes[request.cookies['saved-username']]=[];}
  if (logs.changes[request.cookies['saved-username']]){logs.changes[request.cookies['saved-username']].push(`Post #${request.body.sentnum} Deleted "${mini.posts[request.cookies['saved-username']][request.body.sentnum]}"`)}
  database.user[request.cookies['saved-username']].coins-=1;
  database.user[request.cookies['saved-username']].xp-=1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_deleted','Username',`u?username=${request.cookies['saved-username']}#${mini.posts[request.cookies['saved-username']].length-1}`,'redirect'));
    }else
      
      
      
      if (method==="new-post-comment"){
      if(!request.body.sentcomment){return response.send(msg('include','Comment Value','u'));}
      if(!request.body.commentid){return response.send(msg('include','Comment Id','u'));}
if(mini.posts[request.cookies['saved-username']]&&mini.posts[request.cookies['saved-username']][request.body.commentid].comments){
  if(mini.posts[request.cookies['saved-username']][request.body.commentid].comments.includes((request.body.sentcomment).toLowerCase())){return response.send(msg('post_exists','','u'));}
  }
  if (!mini.posts[request.cookies['saved-username']]){mini.posts[request.cookies['saved-username']]=[]}
  if ((request.body.sentcomment.toLowerCase()).includes("<")&&(request.body.sentcomment.toLowerCase()).includes(">")||(request.body.sentcomment.toLowerCase()).includes("<")&&(request.body.sentpost.toLowerCase()).includes("/") )
  {return response.send("Bad!")}
  mini.posts[request.cookies['saved-username']][request.body.commentid].comments.push({"username":request.cookies['saved-username'],"text":request.body.sentcomment});
    database.user[request.cookies['saved-username']].coins+=0.2;
  database.user[request.cookies['saved-username']].xp+=1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`u?username=${request.cookies['saved-username']}#${mini.posts[request.cookies['saved-username']].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="new-community"){
      console.log(request.body)
  var avatar = "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentcommunity==null||request.body.sentcommunity==undefined||!request.body.sentcommunity){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] == "undefined") {
  database.community[(request.body.sentcommunity).toLowerCase()]=
    {owner:username, preferred:request.body.sentcommunity,
     background:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",banner:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
     description:request.body.sentdesc.toLowerCase(), 
     color:"#000000", avatar:avatar,
     members:[],badges:[],
     creation_date:Date.now()
    }
    mail(database.user[username].email,`Your Community, ${request.body.sentcommunity} on Meown`,null,`A user with the name of ${request.body.sentcommunity} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentcommunity.toLowerCase()}&notification=Account+Created!'"/>`);
  console.log(`Account created, Username: ${(request.body.sentcommunity).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
    }else
      
      
      
    if (method==="new-community-comment"){
      if(!request.body.sentcommunity){return response.send(msg('include','Comment Value','u'));}
      var community = request.body.sentcommunity;
      if(!request.body.sentcomment){return response.send(msg('include','Comment Value','u'));}
      if(!request.body.commentid){return response.send(msg('include','Comment Id','u'));}
if(mini.thread[community]&&mini.thread[community][request.body.commentid].comments){
  if(mini.thread[community][request.body.commentid].comments.includes((request.body.sentcomment).toLowerCase())){return response.send(msg('post_exists','','u'));}
  }
  if (!mini.thread[community]){mini.thread[community]=[]}
  if ((request.body.sentcomment.toLowerCase()).includes("<")&&(request.body.sentcomment.toLowerCase()).includes(">")||(request.body.sentcomment.toLowerCase()).includes("<")&&(request.body.sentpost.toLowerCase()).includes("/") )
  {return response.send("Bad!")}
  mini.thread[community][request.body.commentid].comments.push({"username":request.cookies['saved-username'],"text":request.body.sentcomment});
    database.user[username].coins+=0.2;
  database.user[username].xp+=1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`c?search=${community}#${mini.thread[community].length-1}`,'redirect'))
  }
  
  else{return response.send(msg('missing','Method lol','u'));}

});

app.get("/connect", urlencodedParser, (request, response) => {
  var method = request.query.method;
  if (!method){return response.send(msg('missing','Method','u'));}
  var sent = request.query.method;
  if (!sent){return response.send(msg('missing','Sent','u'));}
  if(request.cookies['saved-username']==undefined||!request.cookies['saved-username']){return response.send(msg('include','Username','u'));}
  var username = request.cookies['saved-username'];
  if (typeof database.user[username] == "undefined") {return response.send(msg('no_account','Username',''));}
  if (!bcrypt.compareSync(request.cookies['saved-password'],database.user[request.cookies['saved-username']].password)){return response.send(msg('incorrect','Username','dashboard'));}
  if (typeof database.community[request.query.sent.toLowerCase()] == "undefined") {return response.send(msg('custom','Password',`c?search=${request.query.sent.toLowerCase()}`));}

if (method==="follow"){
  if(!database.user[request.cookies['saved-username'].toLowerCase()].following.includes(request.query.sent.toLowerCase())){
  database.user[request.cookies['saved-username']].following.push(request.query.sent.toLowerCase());
  database.user[request.query.sent.toLowerCase()].followers.push(request.cookies['saved-username']);
  //database.user[(request.query.sentname).toLowerCase()].coins+=0.1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Followed!'"/>`);
  } else {
    database.user[request.cookies['saved-username']].following=database.user[request.cookies['saved-username']].following.filter(item => item !== request.query.sent.toLowerCase());
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Unfollowed!'"/>`);
  }
}else
  if (method==="join"){
  if(!database.user[request.cookies['saved-username'].toLowerCase()].following.includes(request.query.sent.toLowerCase())){
  database.community[request.query.sent.toLowerCase()].members.push(username);
  database.user[username].communities.push(request.query.sent.toLowerCase());
  //database.user[(request.query.sentname).toLowerCase()].coins+=0.1;
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
  return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Followed!'"/>`);
  } else {
    database.community[request.query.sent.toLowerCase()].members=database.community[request.query.sent.toLowerCase()].members.filter(item => item !==request.cookies['saved-username']);
    database.user[username].communities=database.user[username].communities.filter(item => item !==request.query.sent.toLowerCase());  
    fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.cookies['saved-username']}&notification=User+Unfollowed!'"/>`);
  }
} 
  
  
});


app.post("/login", urlencodedParser, (request, response) => {
  if (!request.body.sentname||!request.body.sentpass){return response.send(msg('include','Username and Password','u'))}
  if (typeof database.user[request.body.sentname] == "undefined") {return response.send(msg('no_account','','u'));}
if (bcrypt.compareSync(request.body.sentpass,database.user[request.body.sentname.toLowerCase()].password)){
if(request.cookies['saved-username']&&request.cookies['saved-password']){
return response.send(msg('logged_in','','u'));
}else{
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 1.2960E+9});
  response.cookie('saved-password', request.body.sentpass, { maxAge: 1.2960E+9});
  return response.send(msg('logged_in','','u','redirect'));
  }
}else {
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
  if (typeof database.user[request.query.username.toLowerCase()] == "undefined") {
    return response.send(msg('no_account','','user'));
  }
response.send(`Username: ${request.body.username.toLowerCase()} <br> Description: ${database.user[request.body.username.toLowerCase()].description} <br> ${currency}: ${database.user[request.body.sentname.toLowerCase()].coins} <br> Creation Date: ${database.user[request.body.username.toLowerCase()].creation_date}`);
});

app.get("/register", (request, response) => {response.render('register', {qs: request.query});});
  
app.post("/register", urlencodedParser, (request, response) => {
  //console.log(request.body);
  var avatar;
  if (typeof database.user[request.query.sentname.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentname==null||request.body.sentname==undefined||!request.body.sentname){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentpass==null||request.body.sentpass==undefined||!request.body.sentpass){return response.send(msg('invalid','Password','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (request.body.sentpass!==request.body.sentpassconfirm){return response.send(msg('match','password & confirm password','register'));}
  //if (request.body.sentname.includes("_")||request.body.sentname.includes("!")||request.body.sentname.includes("_"))
  if (typeof database.user[request.query.sentname.toLowerCase()] == "undefined") {
  if (!request.body.avatar){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}else
  if (request.body.avatar){if (request.body.avatar==="male"){avatar=cartoonavatar.generate_avatar({"gender":"male"});}
  else if (request.body.avatar==="female"){avatar=cartoonavatar.generate_avatar({"gender":"female"})}
  else if (request.body.avatar==="default"){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}
  else{avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}}
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 1.2960E+9});response.cookie('saved-password', request.body.sentpass, { maxAge: 1.2960E+9});
  database.emails.push((request.body.sentname).toLowerCase());
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(request.body.sentpass, salt);
  database.user[(request.body.sentname).toLowerCase()]=
    {password:hash,email:request.body.sentemail, coins:50, xp:0, preferred:request.body.sentname,
     background:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",banner:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
     description:request.body.sentdesc.toLowerCase(), 
     color:"#000000", avatar:avatar,
     following:[],followers:[],communities:[],/*Delete badges if needed*/badges:[],
     creation_date:Date.now()
    }
    mail(request.body.sentemail,`Your account, ${request.body.sentname} on Meown`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
  console.log(`Account created, Username: ${(request.body.sentname).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
  
});
app.post("/new-community", urlencodedParser, (request, response) => {
  //console.log(request.body);
  var avatar;
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentcommunity==null||request.body.sentcommunity==undefined||!request.body.sentname){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (typeof database.user[request.body.sentname.toLowerCase()] == "undefined") {
  if (!request.body.avatar){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}else
  if (request.body.avatar){if (request.body.avatar==="male"){avatar=cartoonavatar.generate_avatar({"gender":"male"});}
  else if (request.body.avatar==="female"){avatar=cartoonavatar.generate_avatar({"gender":"female"})}
  else if (request.body.avatar==="default"){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}
  else{avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}}
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 1.2960E+9});response.cookie('saved-password', request.body.sentpass, { maxAge: 1.2960E+9});
  database.emails.push((request.body.sentname).toLowerCase());
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(request.body.sentpass, salt);
  database.user[(request.body.sentname).toLowerCase()]=
    {password:hash,email:request.body.sentemail, coins:50, xp:0, preferred:request.body.sentname,
     background:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",banner:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
     description:request.body.sentdesc.toLowerCase(), 
     color:"#000000", avatar:avatar,
     following:[],followers:[],communities:[],/*Delete badges if needed*/badges:[],
     creation_date:Date.now()
    }
    mail(request.body.sentemail,`Your account, ${request.body.sentname} on Meown`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
  console.log(`Account created, Username: ${(request.body.sentname).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
  
});
/*var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("2004secret", salt);
console.log(hash)*/

function info_data(x){
  return `
<title>Meown Chat | ${x}</title>
<meta property="og:title" content="Meown | ${x}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://meown.tk" />
<meta property="og:image" content="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664" />
<meta property="og:description" content="The newest, worst social media." />
<meta name="theme-color" content="#cb3837">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">`
  
}




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
var logLab = 'Meown';
var logRoom = ' room ';

io.on('connection', function (socket) {
  var addedUser = false;
  var curRoomName = 'Lobby'
  socket.on('sync', function (data) {
   socket.emit('handshake',database);
  });
  

  
  socket.on('bot message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.to(curRoomName).emit('new message', {
      username: botname,
      message: data//data
    });
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
  

app.get("/api", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var username = request.query.username;if(!username){response.json({"missing":"username"})}
  var method = request.query.method;
  if (typeof database.user[username] == "undefined") {response.json({"missing":"user_from_database"})}
  if (!method){response.json({"missing":"method"})}
  if (method){
  if (method==="user"){
    var user = database.user[username];
    const cloneuser = Object.assign({}, user);
    delete cloneuser.password
    return response.json(cloneuser);
  }
     if (method==="posts"){
    var posts = mini.posts[username]
    return response.send(posts)
  }
  }
});

app.get("/u", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var username = request.query.search;
  var me = request.cookies['saved-username'];
  if (!username){if (me){username=me}else username='null'}
  if (typeof database.user[username] === "undefined") {return response.send(msg('no_account',null,'u'));}
  //var post_number, post_list,comment_number,comment_list,badge_number, badge_list,follow_number, follow_list,community_number,community_list,status,post_bar,comment_bar,profile_menu,side_bar,scripts;
  //post_number=post_list=comment_number=comment_list=badge_number=badge_list=follow_number=follow_list=community_number=community_list=status=post_bar=comment_bar=profile_menu=side_bar=scripts="";
  var vals ={
    "username":username,
    "anti":anti,
    "post_number":"",
    "post_list":"",
    "comment_number":"",
    "comment_list":"",
    "badge_number":"",
    "badge_list":"",
    "follow_number":"",
    "follow_list":"",
    "follow_amount":database.user[username].followers.length,
    "community_number":"",
    "community_list":"",
    "like_number":0,
    "like_list":0,
    "status":"",
    "post_bar":"",
    "comment_bar":"",
    "profile_menu":"",
    "side_bar":"",
    "scripts":"",
    "self_avatar":"https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    "self_link":"/u#login",
    "nav":"",
    "nav_mobile":"",
    "info_data":info_data,
    "visible":{
    "login_register":"",
    "post_bar":"hidden"
  }
  }
  var nav = ``//`<form method="get" action="/u" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding" placeholder="Find User" style="width:20vw;"></input></form>`;
  var nav_mobile = ``//`<form method="get" action="/u" style="display:inline-block;"><input type="text" name="search" class="simple-border simple-padding"  placeholder="Find User" style="width:69vw;"></input><button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`;
  
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(me!==undefined){
    vals.self_avatar=database.user[me].avatar;
    vals.self_link=`/u?username=${me}`;
    vals.status=`Logged in as: ${me.toUpperCase()}`;
    vals.profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="../dashboard" class="simple-bar-item simple-button">Dashboard</a><form method="POST" action="/logout"><button type="submit" class="simple-bar-item simple-button">Logout</button></form></div> `;
    vals.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`
    
      
    if (bcrypt.compareSync(request.cookies['saved-password'],database.user[me].password)){
      vals.visible.login_register = "hidden";
      if(me==username){vals.visible.post_bar = ``}
  }
  }else{
    vals.status='not logged in';
    vals.profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="#login" class="simple-bar-item simple-button">Login</a><a href="#register" class="simple-bar-item simple-button">Register</a></div> `

  };
  
  if(me!==undefined&&me!==username&&username!=='guest'&&username!=='null'){
  if (!logs.views[username]){logs.views[username]=0;}
  logs.views[username]+=1;
  if (database.user[me].following.includes(username)){nav += `<a href="/connect?sent=${username}&method=follow" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heartbeat"></i></a>`}else{
  vals.nav += `<a href="/connect?sent=${username}&method=follow" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heart"></i></a>`}
  }
  
    if(database.user[username].badges.includes("creator")){vals.badge_list += "Creator ";}
    if(database.user[username].badges.includes("developer")){vals.badge_list += "Developer ";}
    if(database.user[username].badges.includes("moderator")){vals.badge_list += "Moderator ";}
    if(database.user[username].badges.includes("helper")){vals.badge_list += "Helper&nbsp:) ";}
    if(database.user[username].badges.includes("early_member")){vals.badge_list += "Early Member ";}
    if(database.user[username].badges.includes("long_user")){vals.badge_list += "Long Time User ";}
    if(database.user[username].badges.includes("testing")){vals.badge_list += "Testing ";}
    if (vals.badge_list){vals.badge_list = vals.badge_list.replace(/[ ]+/g, ", ");
    fix_end();function fix_end(){if (vals.badge_list.endsWith(",")||vals.badge_list.endsWith(" ")){vals.badge_list=vals.badge_list.slice(0, -1);fix_end();}}}else
    if (!vals.badge_list){vals.badge_list="This User has no badges"}
  
  
  
    if(typeof mini.posts[username] !== "undefined"){vals.comment_list=``;
  for (vals.post_number in mini.posts[username]) {
    if(typeof mini.posts[username][vals.post_number] !== "undefined"){
    for (vals.comment_number in mini.posts[username][vals.post_number].comments){
      if (typeof database.user[mini.posts[username][vals.post_number].comments[vals.comment_number].username] !== "undefined"){
      vals.comment_list+=`<a>${mini.posts[username][vals.post_number].comments[vals.comment_number].username}: ${mini.posts[username][vals.post_number].comments[vals.comment_number].text}</a><br>`
      }
    }
      if(me!==undefined){
      vals.comment_bar=`<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-col m12"><div class="simple-card simple-round simple-white"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="sentname" value="${me}">
              <input type="hidden" name="sentpass" value="${me}">
              <input type="hidden" name="method" value="new-post-comment">
              <input type="hidden" name="commentid" value="${vals.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`
      }
    }
    vals.like_list=0;for (vals.like_number in mini.posts[username][vals.post_number].likes){
      if (typeof database.user[mini.posts[username][vals.post_number].likes[vals.like_number]] !== "undefined"){
        vals.like_list+=1;
      }
    }
    vals.post_list +=  `<div class="simple-container simple-card simple-white simple-round simple-margin" id="post-${[vals.post_number]}"><br>
        <img src="${`${database.user[username].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px"> 
        <span class="simple-right simple-opacity">#${vals.post_number}</span>
        
        <button class="simple-right simple-opacity" onclick="copy('https://${request.hostname}/u?search=${username}#post-${vals.post_number}');notification('Link Copied!')">
        <i class="fa fa-link"></i>
        &nbsp;</button>
        <span class="simple-right simple-opacity" >
        <form method="post" action="/edit">
        <input type="hidden" name="method" value="like">
        <input type="hidden" name="type" value="post">
        <input type="hidden" name="sentid" value="${vals.post_number}">
        <button type="submit" onclick="notification('<3!')">
        <i class="fa fa-heart" ></i>
        ${vals.like_list}
        </button>
        </form>
        &nbsp;</span>
        <br><b style="font-size: 2em;" >&nbsp${database.user[username].preferred}: </b>
        <a style="font-size: 1.5em;">${mini.posts[username][vals.post_number].title} </a><br>
        <hr class="simple-clear">
        <p>${mini.posts[username][vals.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="accordion('comments_${vals.post_number}')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${vals.post_number}" class="simple-hide simple-container">
            <p>${vals.comment_list}${vals.comment_bar}</p>
          </div>
      </div>` ;
    vals.comment_list=``;
  }}
  
 
  if(typeof database.user[username].following !== "undefined"){
    if(database.user[username].following.length-1 < 0){vals.follow_list="No One"}
  for (vals.follow_number in database.user[username].following) {
    vals.follow_list +=  `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/u?search=${database.user[username].following[vals.follow_number]}');">${database.user[username].following[vals.follow_number]}</span>`
    if (database.user[username].following.length-1 > vals.follow_number){
    if(database.user[username].following.length-1 > 0){vals.follow_list += `, `};
    }
  }}
  if(typeof database.user[username].communities !== "undefined"){
    if(database.user[username].communities.length-1 < 0){vals.community_list="None"}
  for (vals.community_number in database.user[username].communities) {
    vals.community_list +=  `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/c?search=${database.user[username].communities[vals.community_number]}');">${database.user[username].communities[vals.community_number]}</span>`
    if (database.user[username].communities.length-1 > vals.community_number){
    if(database.user[username].communities.length-1 > 0){vals.community_list += `, `};
    }
  }}
  //var get = new main(database, mini,username,null,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar);
//response.send(get.u());
response.render('u.ejs', { database: database,values:vals});
});













app.get("/c", (request, response) => {
  var username = request.query.username;
  var community = request.query.search;
  if (!username){if (request.cookies['saved-username']){username=request.cookies['saved-username']}else username='null'}
  if (typeof database.user[username] == "undefined") {return response.send(msg('no_account',null,'u'));}
  if (typeof database.community[community] == "undefined") {return response.send(msg('no_account',null,'u'));}
    var vals ={
    "username":username,
    "community":community,
    "anti":anti,
    "post_number":"",
    "post_list":"",
    "comment_number":"",
    "comment_list":"",
    "badge_number":"",
    "badge_list":"",
    "follow_number":"",
    "follow_list":"",
    "follow_amount":database.community[community].members.length,
    "community_number":"",
    "community_list":"",
    "like_number":0,
    "like_list":0,
    "status":"",
    "post_bar":"",
    "comment_bar":"",
    "profile_menu":"",
    "side_bar":"",
    "scripts":"",
    "self_avatar":"https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg",
    "self_link":"/u#login",
    "nav":"",
    "nav_mobile":"",
    "info_data":info_data,
    "visible":{
    "login_register":"",
    "post_bar":"hidden"
  }
  }
  var nav = `<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="simple-border simple-padding" placeholder="Find User" style="width:20vw;"></input><button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`;
  var nav_mobile = `<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="simple-border simple-padding"  placeholder="Find User" style="width:69vw;"></input><button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`;
  
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(request.cookies['saved-username']!==undefined){
    vals.self_avatar=database.user[request.cookies['saved-username']].avatar;
    vals.self_link=`/u?username=${request.cookies['saved-username']}`;
    status=`Logged in as: ${request.cookies['saved-username'].toUpperCase()}`;
    vals.profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="../dashboard" class="simple-bar-item simple-button">Dashboard</a><form method="POST" action="/logout"><button type="submit" class="simple-bar-item simple-button">Logout</button></form></div> `;
    vals.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`
    
    if (bcrypt.compareSync(request.cookies['saved-password'],database.user[username].password)){
      vals.visible.login_register = "hidden";
      if(request.cookies['saved-username']==username){vals.visible.post_bar = ``;}
  }
  }else{
    status='not logged in';
    vals.profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;">
      <a href="#login" class="simple-bar-item simple-button">Login</a>
      <a href="#register" class="simple-bar-item simple-button">Register</a>
    </div> `
    vals.visible.login_register = 'hidden';
  };
  
  if(typeof database.user[request.cookies['saved-username']] !== "undefined"){
  if (!logs.views[username]){logs.views[username]=0;}
  logs.views[username]+=1;
  if (database.community[community].members.includes(username)){nav += `<a href="/connect?sent=${community}&method=join" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heartbeat"></i></a>`}else{
  nav += `<a href="/connect?sent=${community}&method=join" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heart"></i></a>`}
  }
    if(typeof mini.thread[community] !== "undefined"){vals.comment_list=``;
  for (vals.post_number in mini.thread[community]) {
    if(typeof mini.thread[community][vals.post_number] !== "undefined"){
    for (vals.comment_number in mini.thread[community][vals.post_number].comments){
      if (typeof database.user[mini.thread[community][vals.post_number].comments[vals.comment_number].username] !== "undefined"){
      vals.comment_list+=`<a>${mini.thread[community][vals.post_number].comments[vals.comment_number].username}: ${mini.thread[community][vals.post_number].comments[vals.comment_number].text}</a><br>`
      }
    }
      if(request.cookies['saved-username']!==undefined){
      vals.comment_bar=`<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-col m12"><div class="simple-card simple-round simple-white"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="method" value="new-community-comment">
              <input type="hidden" name="sentcommunity" value="${community}">
              <input type="hidden" name="commentid" value="${vals.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`
      }
    }
    vals.like_list=0;for (vals.like_number in mini.thread[vals.community][vals.post_number].likes){
      if (typeof database.community[mini.thread[vals.community][vals.post_number].likes[vals.like_number]] !== "undefined"){
        vals.like_list+=1;
      }
    }
    vals.post_list +=  `<div class="simple-container simple-card simple-white simple-round simple-margin" id="post-${[vals.post_number]}"><br>
        <img src="${`${database.user[username].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px">
        <span class="simple-right simple-opacity">#${vals.post_number}</span>
        <button class="simple-right simple-opacity" onclick="copy('https://${request.hostname}/c?search=${vals.community}#post-${vals.post_number}');notification('Link Copied!')">
        <i class="fa fa-link"></i>
        &nbsp;</button>
        
        <span class="simple-right simple-opacity" >
        <form method="post" action="/edit">
        <input type="hidden" name="method" value="like">
        <input type="hidden" name="type" value="thread">
        <input type="hidden" name="community" value="${vals.community}">
        <input type="hidden" name="sentid" value="${vals.post_number}">
        <button type="submit" onclick="notification('<3!')">
        <i class="fa fa-heart"></i>
        ${vals.like_list}
        </button>
        </form></span>
        <br><b style="font-size: 2em;">&nbsp${database.user[username].preferred}: </b>
        <a style="font-size: 1.5em;">${mini.thread[community][vals.post_number].title} </a><br>
        <hr class="simple-clear">
        <p>${mini.thread[community][vals.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="accordion('comments_${vals.post_number}')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${vals.post_number}" class="simple-hide simple-container">
            <p>${vals.comment_list}${vals.comment_bar}</p>
          </div>
      </div>` ;
    vals.comment_list=``;
  }}
response.render('c.ejs', { database: database,values:vals});
});




app.get("/", function(request, response) {
    var status = "";var post_bar = "";var profile_menu = "";var side_bar="";
  var self_avatar="https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg";
  var self_link="/u#login";
var username="empty";
  
  var nav = `<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="simple-border simple-padding" style="width:20vw;" placeholder="Find User"></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`;
  var scripts = "";
  
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(request.cookies['saved-username']!==undefined){
    if (typeof database.user[request.cookies['saved-username']] == "undefined") {return response.send(no_account_message+`<button onclick="location.replace('/user')">Find a different user.</button>`);}
    self_avatar=database.user[request.cookies['saved-username']].avatar;
    username=request.cookies['saved-username'];
    self_link=`/u?username=${request.cookies['saved-username']}`;
    status=`Logged in as: ${request.cookies['saved-username'].toUpperCase()}`;
    profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><!--
      <form method="POST" action="/logout">
<button type="submit" class="simple-bar-item simple-button">Logout</button>
</form>-->
    </div> `
  }else{
    status='not logged in';
    profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300 px;right:0;top:51px;"><!--
      <a href="../u#login" class="simple-bar-item simple-button">Login</a>
      <a href="../u#register" class="simple-bar-item simple-button">Register</a>
-->
    </div> `
  };
  var get = new main(database,null,username,null,currency,status,self_avatar,self_link,profile_menu);
response.send(get.slash());

  
});



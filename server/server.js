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
var port = process.env.PORT || 3232;
var hostname = config.url; // replace with the web domain you are currently using Ex. google.com which will then be a variable to added to https:// HOSTNAME then whatever redirect it's supposed to be
var currency = "Coins";
var botname = '⚙️ !v! ittz';
var prefix = '$';
var anti="this.value = this.value.replace(/[^a-z0-9]/i, '')"
var logs = {
views:{
  
      },
changes:{}
}
function a0(x){
  return /[^a-z0-9]/i.test(x)
}
function html_check(x){
  return /<\s*[^>]*>/g.test(x)
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

var date = new Date();
 var time={
  "full":date,
  "year":date.getFullYear(),
  "month":date.getMonth(),
  "day":date.getDate(),
  "hour":date.getHours(),
  "minute":date.getMinutes(),
  "second":date.getSeconds(),
  "milisecond":date.getMiliseconds
}
do_am_pm();
var am_pm;
function do_am_pm(){
  if (date.getHours()-4 < 12){ am_pm = "AM"
  } else if (date.getHours()-4 > 12){ am_pm = "PM"
  } else {am_pm =  "broken??"}
}
server.listen(port, function () {
  console.log('Server listening at port %d', port);
  //console.log(process.env)
console.log(`Time: ${(date.getMonth()+1)}/${(date.getDate())}/${(date.getFullYear())} ${date.getHours()-4}:${date.getMinutes()}:${date.getSeconds()} ${am_pm}`);
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
var me = request.cookies['saved-username'];

  var values = {
    "database":database,
    "mini":mini,
    "username":me,
    "currency":currency,
    "followers":database.user[me].followers,
    "recent_followers":"",
    "follows":database.user[me].following,
    "recent_follows":"",
    "changes":logs.changes[me],
    "recent_changes":"",
    "reports":"database.mini.reports.glitches[request.cookies['saved-username']]",
    "recent_reports":"",
    "last":3,
    "i":"",
    "views":"",
    "forms":""
    
  }
values.forms+=`
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
if(database.user[request.cookies['saved-username']].roles.includes("developer")||database.user[request.cookies['saved-username']].roles.includes("moderator")){
  values.forms+=`
<input type="text" name="sentnewbackground" placeholder="Change Background (optional)" style="width:80vw;"><br>
<input type="text" name="sentnewbanner" placeholder="Change Banner (optional)" style="width:80vw;"><br>
`
}
values.forms+=`
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
      </div>
    </div>
  </form>
  `
values.forms+=`
 <form method="post" action="/edit" >
    <div class="row">
      <a style="font-size: 1.5em;">Redeem code</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="method" value="redeem">
        <input type="text" name="sentcode" class="simple-border simple-padding" style="width:200px;" placeholder="Code" required>
      </div>
    </div>
  </form> 
<form method="post" action="/edit" >
    <div class="row">
      <a style="font-size: 1.5em;">New Community</a>
      <div class="col">
        <div class="hide-md-lg">
        </div>
        <input type="hidden" name="method" value="new-community">
        <input type="text" name="sentcommunity" class="simple-border simple-padding" style="width:200px;" placeholder="Community Name" minlength="3" maxlength="15" onkeyup="${anti}" required>
        <input type="text" name="sentdesc" class="simple-border simple-padding" style="width:200px;" placeholder="Description"required>
      </div>
    </div>
  </form>
  `
if (values.changes){
if (values.changes.length<3){values.last=2}if (values.changes.length<2){values.last=1}if (values.changes.length<1){values.last=0}
for (values.i = 0; values.i < values.last; values.i++) {
  if (typeof database.user[request.cookies['saved-username']] !== "undefined"){
  values.recent_changes += `<li class="simple-padding-16">
        <img src="${database.user[request.cookies['saved-username']].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${request.cookies['saved-username']}">${values.changes[values.i+values.changes.length-values.last]}</a></span><br>
      </li>`;}}
}else{values.recent_changes="None"}
if (values.follows!==""){
if (values.follows.length<3){values.last=2}if (values.follows.length<2){values.last=1}if (values.follows.length<1){values.last=0}
for (values.i = 0; values.i < values.last; values.i++) {
  if (typeof database.user[values.follows[values.i+values.follows.length-values.last]] !== "undefined"){
  values.recent_follows += `<li class="simple-padding-16">
        <img src="${database.user[values.follows[values.i+values.follows.length-values.last]].avatar}" class="simple-left simple-circle simple-margin-right" style="width:35px">
        <span class="simple-xlarge"><a href="../u?username=${values.follows[values.i+values.follows.length-values.last]}">${values.follows[values.i+values.follows.length-values.last]}</a></span><br>
      </li>`;}}
}else{values.recent_follows="None"}
  if (values.followers!==""){
if (values.followers.length>=3){values.last=3}if (values.followers.length<3){values.last=2}if (values.followers.length<2){values.last=1}if (values.followers.length<1){values.last=0}
for (values.i = 0; values.i < values.last; values.i++) {
  if (typeof database.user[values.followers[values.i+values.followers.length-values.last]] !== "undefined"){
  values.recent_followers += `<div class="simple-row">
      <div class="simple-col m2 text-center">
        <img class="simple-circle" src="${database.user[values.followers[values.i+values.followers.length-values.last]].avatar}" style="width:96px;height:96px">
      </div>
      <div class="simple-col m10 simple-container">
        <h4>${values.followers[values.i+values.followers.length-values.last]} <span class="simple-opacity simple-medium">Follower #${values.i+values.followers.length-values.last}</span></h4>
        <br>
      </div>
    </div>`;}}
  }else{values.recent_followers ="None"}
  var username= request.cookies['saved-username'];
if (!logs.views[request.cookies['saved-username']]){values.views=0};
if (logs.views[request.cookies['saved-username']]){values.views=logs.views[request.cookies['saved-username']]};
  //var get = new dashboard(database, mini,username,currency,views,forms,recent_follows,recent_followers,recent_changes);
//response.send(get.html());
  response.render('dashboard.ejs', { database: database,values:values});
  
});


app.post("/edit", urlencodedParser, (request, response) => {
  var method = request.body.method;
  if (!method){return response.send(msg('missing','Method','u'));}
  if(request.cookies['saved-username']==undefined||!request.cookies['saved-username']){return response.send(msg('include','Username','u'));}
  var username = request.cookies['saved-username'];
  var me = request.cookies['saved-username'];
  if (typeof database.user[username] == "undefined") {return response.send(msg('no_account','Username',''));}
  if (!bcrypt.compareSync(request.cookies['saved-password'],database.user[request.cookies['saved-username']].password)){return response.send(msg('incorrect','Username','dashboard'));}
  
  if (method==="details"){
  var text_add='';
  if(request.body.sentnewpass){database.user[request.cookies['saved-username']].password=request.body.sentnewpass;text_add+=`New Password: ${request.body.sentnewpass}`}
  if(request.body.sentnewdesc){database.user[request.cookies['saved-username']].description=request.body.sentnewdesc;}
  if(request.body.sentnewavatar){database.user[request.cookies['saved-username']].avatar=request.body.sentnewavatar;}
  if(database.user[request.cookies['saved-username']].roles.includes("developer")||database.user[request.cookies['saved-username']].roles.includes("moderator")){
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

      if(html_check(request.body.sentposttitle)||html_check(request.body.sentpostbody)) 
        {return response.send(msg('custom','Do not use html!','u'));}
        var text = "";
var i = 0;var character = "!n ";
        //var paren = str.includes("(")&&str.charAt(str.indexOf("(")+1)==character.charAt(0)/*if ( then !*/&&str.charAt(str.indexOf("(")+2)==character.charAt(1)/* if ( then !+n*/&&str.charAt(str.indexOf("(")+3)==character.charAt(2)/* if ( then !+n+ (SpaceBar)*/;
while (i < request.body.sentpostbody.length&&request.body.sentpostbody.includes(character)) {
  request.body.sentpostbody=request.body.sentpostbody.replace(character, '<br>');
  i++;
}
      
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
    
    
    
    if (method==="report"){
      if(!request.body.sentposttitle){return response.send(msg('include','Post Value','u'));}
      if(!request.body.sentpostbody){return response.send(msg('include','Post Value','u'));}

      if(html_check(request.body.sentposttitle)||html_check(request.body.sentpostbody)) 
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
    
    
      
      if (method==="redeem"){
  if (typeof database.codes[request.body.sentcode] == "undefined"){return response.send(msg('custom','Invalid Code!','dashboard'));}
  if (database.user[me].codes.includes(request.body.sentcode)){return response.send(msg('custom','Code Exists!','dashboard'));}
  if (!logs.changes[me]){logs.changes[me]=[];}
  if (logs.changes[me]){logs.changes[me].push(`Code Redeemed: "${request.body.sentcode}" for ${database.codes[request.body.sentcode]} ${currency} `)}
  database.user[me].codes.push(request.body.sentcode);
  database.user[me].coins+=database.codes[request.body.sentcode];
  //fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('custom','Code Redeemed',`dashboard`));
    }else
    
    
      
    if (method==="like"){
      var type;var check;
      if (!mini.posts[request.cookies['saved-username']]){response.send(msg('missing','Post??!!','u'))}
      if(!request.body.sentid){return response.send(msg('include','Post Value','u'));}
      if(!request.body.type){return response.send(msg('include','Type','u'));}else{type=request.body.type}
      if (type==="posts"){check=mini.posts[request.body.sentname][request.body.sentid]}else
        console.log(request.body.sentname)
        console.log(request.body.sentid)
        if (type==="thread"){check=mini.thread[request.body.sentname][request.body.sentid]}else {response.send(msg('custom','Error??!!','u'))}
      //console.log(check);
    if(!check.likes.includes(username)){
      check.likes.push(username);
  //database.user[(request.query.sentname).toLowerCase()].coins+=0.1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${username}&notification=${type}+Liked!'"/>`);
  } else {
    check.likes=check.likes.filter(item => item !== username);
    fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
    return response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${username}&notification=${type}+UnLiked!'"/>`);
  }
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('custom',`${type}`,`u?username=${username}#${mini.posts[username].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="new-thread"){
if(!request.body.sentcommunity){return response.send(msg('include','Comment Value','u'));}
      var community = request.body.sentcommunity;
      if(!request.body.sentposttitle){return response.send(msg('include','Post Value','u'));}
      if(!request.body.sentpostbody){return response.send(msg('include','Post Value','u'));}

      if(html_check(request.body.sentposttitle)||html_check(request.body.sentpostbody)) 
        {return response.send(msg('custom','Do not use html!','u'));}

if(mini.thread[community]){
  if(mini.thread[community].includes((request.body.sentposttitle).toLowerCase())){return response.send(msg('post_exists','','u'));}
  }
  if (!mini.thread[community]){mini.thread[community]=[]}
  mini.thread[community].push({"sender":me,"title":request.body.sentposttitle,"body":request.body.sentpostbody,"likes":[],"comments":[]});
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`c?search=${community}#${mini.thread[community].length-1}`,'redirect'))
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
  mini.posts[request.cookies['saved-username']][request.body.commentid].comments.push({"sender":me,"text":request.body.sentcomment});
    database.user[request.cookies['saved-username']].coins+=0.2;
  database.user[request.cookies['saved-username']].xp+=1;
  fs.writeFileSync(mini_location, JSON.stringify(mini, null, 2));
  return response.send(msg('post_created','Username',`u?username=${request.cookies['saved-username']}#${mini.posts[request.cookies['saved-username']].length-1}`,'redirect'))
  }else
    
    
    
    if (method==="new-community"){
      //console.log(request.body)
  var avatar = "https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png";
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentcommunity==null||request.body.sentcommunity==undefined||!request.body.sentcommunity){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] == "undefined") {
    database.user[me].communities.push(request.body.sentcommunity.toLowerCase());
    database.community[(request.body.sentcommunity).toLowerCase()]=
    {owner:username, preferred:request.body.sentcommunity,
     background:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",banner:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
     description:request.body.sentdesc.toLowerCase(), 
     color:"#000000", avatar:avatar,
     creation_date:Date.now()
    }
    mail(database.user[username].email,`Your Community, ${request.body.sentcommunity} on Meown`,null,`A user with the name of ${request.body.sentcommunity} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(msg('custom','',`c?search=${request.body.sentcommunity}`));
  console.log(`Account created, Username: ${(request.body.sentcommunity).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
    }else
      
      
      
    if (method==="new-thread-comment"){
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
  mini.thread[community][request.body.commentid].comments.push({"sender":me,"text":request.body.sentcomment});
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

app.get("/logout", urlencodedParser, (request, response) => {
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
  if (typeof database.user[request.body.sentname.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentname==null||request.body.sentname==undefined||!request.body.sentname){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentpass==null||request.body.sentpass==undefined||!request.body.sentpass){return response.send(msg('invalid','Password','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if (request.body.sentpass!==request.body.sentpassconfirm){return response.send(msg('match','password & confirm password','register'));}
  //if (request.body.sentname.includes("_")||request.body.sentname.includes("!")||request.body.sentname.includes("_"))
  if(a0(request.body.sentname)||html_check(request.body.sentdesc)) 
  {return response.send(msg('custom','Do not use custom characters or html!','u'));}
  if (typeof database.user[request.body.sentname.toLowerCase()] == "undefined") {
  if (!request.body.avatar){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}else
  if (request.body.avatar){if (request.body.avatar==="male"){avatar=cartoonavatar.generate_avatar({"gender":"male"});}
  else if (request.body.avatar==="female"){avatar=cartoonavatar.generate_avatar({"gender":"female"})}
  else if (request.body.avatar==="default"){avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}
  else{avatar="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png"}}
  response.cookie('saved-username', request.body.sentname.toLowerCase(), { maxAge: 1.2960E+9});response.cookie('saved-password', request.body.sentpass, { maxAge: 1.2960E+9});
  database.emails.push((request.body.sentemail).toLowerCase());
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(request.body.sentpass, salt);
  database.user[(request.body.sentname).toLowerCase()]=
    {password:hash,email:request.body.sentemail, coins:50, xp:0, preferred:request.body.sentname,
     background:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",banner:"https://th.bing.com/th/id/OIP.wNTfurfJeTEB8wRa4iwqYAAAAA",
     description:request.body.sentdesc.toLowerCase(), 
     color:"#000000", avatar:avatar,
     following:[],followers:[],communities:[],codes:[],/*Delete badges if needed*/roles:[],
     creation_date:Date.now()
    }
    mail(request.body.sentemail,`Your account, ${request.body.sentname} on Meown`,null,`A user with the name of ${request.body.sentname} on <a href="https://meown.tk">Meown</a> created an account by this email, Your login details are <br><li>Username: ${request.body.sentname}</li><li>Password: ${request.body.sentpass}</li><li>Description: ${request.body.sentdesc}</li>`).catch(console.error);
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
    response.send(`<meta http-equiv="Refresh" content="0; url='/u?username=${request.body.sentname.toLowerCase()}&notification=Account+Created!'"/>`);
  console.log(`Account created, Username: ${(request.body.sentname).toLowerCase()}, Password: ${(request.body.sentpass).toLowerCase()} , Description: ${(request.body.sentdesc).toLowerCase()}`)
      }
  
});
app.post("/new-community", urlencodedParser, (request, response) => {
  var avatar;
  if (typeof database.community[request.body.sentcommunity.toLowerCase()] !== "undefined") {return response.send(msg('exists','d','u'));}
  if (request.body.sentcommunity==null||request.body.sentcommunity==undefined||!request.body.sentname){return response.send(msg('invalid','Username','register'));}
  if (request.body.sentdesc==null||request.body.sentdesc==undefined||!request.body.sentdesc){return response.send(msg('invalid','Description','register'));}
  if(a0(request.body.sentcommunity)||html_check(request.body.sentdesc)) 
  {return response.send(msg('custom','Do not use custom characters or html!','u'));}
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
     following:[],followers:[],members:[],
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
<link rel="icon" type="image/png" href="https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie32bfull.png">
`
  
}

app.get("/api", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var search = request.query.search;
  var method = request.query.method;
  
  if (!method){response.json({"response":"method"})}
  if (method){
  if (method==="user"){
    if(!search){response.json({"response":"name_/_id_/_variant"})}
    if (typeof database.user[search] == "undefined") {response.json({"response":"user_from_database"})}
    var user = database.user[search];
    const cloneuser = Object.assign({}, user);
    delete cloneuser.password;
    delete cloneuser.email;
    return response.json(cloneuser);
  }else
    if (method==="users"){
    return response.json(Object.keys(database.user))
  }else
     if (method==="posts"){
       if(!search){response.json({"response":"name_/_id_/_variant"})}
       if (typeof mini.posts[search] == "undefined"||typeof database.user[search] == "undefined") {response.json({"response":"user_from_database"})}
    var posts = mini.posts[search]
    return response.send(posts)
  }else
    if (method==="communities"){
    return response.json(Object.keys(database.community))
  }else{response.json({"response":"no_results"})}
  }
});



function add_detail(icon,text){
    if (!icon){icon='fa-question-circle'};
    return `<p><i class="fa ${icon} fa-fw simple-margin-right simple-text-theme"></i>${text}</p>`
  }


function social(values){
  if (typeof values === "undefined"){return "ERROR"}
  if (!values.id){values.id = "username"}
  if (!values.category){values.id = "user"}
  if (!values.me){values.me = "null"}
  //var data_type;
  //if (values.category==="user"){data_type = database.user;}else
  //if (values.category==="community"){data_type = database.community;}else
    //{data_type=database.user}
  if (typeof values.background === "undefined"){values.background = "simple-theme-orange-red.css"}
  
  if(values.me!==undefined){
    values.self_avatar=database.user[values.me].avatar;
    values.self_link=`/u?username=${values.me}`;
    values.status=`Logged in as: ${values.me.toUpperCase()}`;
    values.profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="../dashboard" class="simple-bar-item simple-button">Dashboard</a><form method="get" action="/logout"><button type="submit" class="simple-bar-item simple-button">Logout</button></form></div> `;
    values.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`
    if (values.category==="community"){if(values.data_type[values.id].members.includes(values.me)){values.visible.logged_in = "hidden";
      values.visible.logged_out = "";}}
if (typeof values.password !== "undefined"){
    if (bcrypt.compareSync(values.password,database.user[values.me].password)){
      values.visible.logged_in = "hidden";
      values.visible.logged_out = "";
      if(values.me==values.id){values.visible.post_bar = ``}
      }
}
  
  }else{
    values.status='not logged in';
    values.profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="#login" class="simple-bar-item simple-button">Login</a><a href="#register" class="simple-bar-item simple-button">Register</a></div> `

  };
  
  if(values.me!==undefined&&values.me!==values.id&&values.id!=='guest'&&values.id!=='null'){
  if (!logs.views[values.id]){logs.views[values.id]=0;}
  logs.views[values.id]+=1;
  var join_type,connect_type;
  if (values.category==="user"){join_type="following";connect_type="follow"}else{join_type="members";connect_type="join"}
  if (values.data_type[values.id][join_type].includes(values.me)){
  values.nav += `<a href="/connect?sent=${values.id}&method=${connect_type}" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heartbeat"></i></a>`}else{
  values.nav += `<a href="/connect?sent=${values.id}&method=${connect_type}" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heart"></i></a>`}
  }
    if (values.category==="user"){
    if(values.data_type[values.id].roles.includes("creator")){values.role_list += "Creator ";}
    if(values.data_type[values.id].roles.includes("developer")){values.role_list += "Developer ";}
    if(values.data_type[values.id].roles.includes("moderator")){values.role_list += "Moderator ";}
    if(values.data_type[values.id].roles.includes("helper")){values.role_list += "Helper&nbsp:) ";}
    if(values.data_type[values.id].roles.includes("early_member")){values.role_list += "Early Member ";}
    if(values.data_type[values.id].roles.includes("long_user")){values.role_list += "Long Time User ";}
    if(values.data_type[values.id].roles.includes("testing")){values.role_list += "Testing ";}
    if (values.role_list){values.role_list = values.role_list.replace(/[ ]+/g, ", ");
    fix_end();function fix_end(){if (values.role_list.endsWith(",")||values.role_list.endsWith(" ")){values.role_list=values.role_list.slice(0, -1);fix_end();}}}else
    if (!values.role_list){values.role_list="This User has no roles"}
    }
  var post_type="posts";
  if (values.category==="user"){post_type="posts"}else{post_type="thread"}
    if(typeof mini[post_type][values.id] !== "undefined"){values.comment_list=``;
  //for (values.post_number in mini.posts[username]) {
    while (values.post_number < mini[post_type][values.id].length) {
    if(typeof mini[post_type][values.id][values.post_number] !== "undefined"){
    for (values.comment_number in mini[post_type][values.id][values.post_number].comments){
      if (typeof values.data_type[mini[post_type][values.id][values.post_number].comments[values.comment_number].sender] !== "undefined"){
      values.comment_list+=`<a>${mini[post_type][values.id][values.post_number].comments[values.comment_number].sender}: ${mini[post_type][values.id][values.post_number].comments[values.comment_number].text}</a><br>`
      }
    }
      if(values.me!==undefined){
      values.comment_bar=`<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-col m12"><div class="simple-card simple-round simple-white"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="sentname" value="${values.me}">
              <input type="hidden" name="sentpass" value="${values.me}">
              <input type="hidden" name="method" value="new-post-comment">
              <input type="hidden" name="commentid" value="${values.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`
      }
    }
      
    values.like_list=0;for (values.like_number in mini[post_type][values.id][values.post_number].likes){
      if (typeof database.user[mini[post_type][values.id][values.post_number].likes[values.like_number]] !== "undefined"){
        values.like_list+=1;
        
      }
    }
    values.post_list +=  `<div class="simple-container simple-card simple-white simple-round simple-margin" id="post-${[values.post_number]}"><br>
        <img src="${`${values.data_type[values.id].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px"> 
        <span class="simple-right simple-opacity">#${values.post_number}</span>
        
        <button class="simple-right simple-opacity" onclick="copy('https://${values.hostname}/u?search=${values.id}#post-${values.post_number}');notification('Link Copied!')">
        <i class="fa fa-link"></i>
        &nbsp;</button>
        <span class="simple-right simple-opacity" >
        <form method="post" action="/edit">
        <input type="hidden" name="method" value="like">
        <input type="hidden" name="type" value="${post_type}">
        <input type="hidden" name="sentname" value="${values.id}">
        <input type="hidden" name="sentid" value="${values.post_number}">
        <button type="submit" onclick="notification('<3!')">
        <i class="fa fa-heart" ></i>
        ${values.like_list}
        </button>
        </form>
        &nbsp;</span>
        <br><b style="font-size: 2em;" >&nbsp${values.data_type[values.id].preferred}: </b>
        <a style="font-size: 1.5em;">${mini[post_type][values.id][values.post_number].title} </a><br>
        <hr class="simple-clear">
        <p>${mini[post_type][values.id][values.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="accordion('comments_${values.post_number}')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${values.post_number}" class="simple-hide simple-container">
            <p>${values.comment_list}${values.comment_bar}</p>
          </div>
      </div>` ;
    values.comment_list=``;
      
  values.post_number++}}
  
 
  if(typeof values.data_type[values.id].following !== "undefined"){
    if(values.data_type[values.id].following.length-1 < 0){values.follow_list="No One"}
  for (values.follow_number in values.data_type[values.id].following) {
    values.follow_list +=  `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/u?search=${values.data_type[values.id].following[values.follow_number]}');">${values.data_type[values.id].following[values.follow_number]}</span>`
    if (values.data_type[values.id].following.length-1 > values.follow_number){if(values.data_type[values.id].following.length-1 > 0){values.follow_list += `, `};}
  }}
  if(typeof values.data_type[values.id].communities !== "undefined"){
    if(values.data_type[values.id].communities.length-1 < 0){values.community_list="None"}
  for (values.community_number in values.data_type[values.id].communities) {
    values.community_list +=  `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/c?search=${values.data_type[values.id].communities[values.community_number]}');">${values.data_type[values.id].communities[values.community_number]}</span>`
    if (values.data_type[values.id].communities.length-1 > values.community_number){if(values.data_type[values.id].communities.length-1 > 0){values.community_list += `, `};}
  }}
  values.details = `
  <h4 class="simple-center" style="color:${values.data_type[values.id].color }">${values.data_type[values.id].preferred} </h4>
         <p class="simple-center"><img src="${values.data_type[values.id].avatar }" class="simple-circle" style="height:106px;width:106px" alt="User Avatar"></p>
         <hr>
         ${add_detail('fa-user',`${values.id}`)} ${add_detail('fa-birthday-cake',`${values.data_type[values.id].creation_date}`)}
  `
  if (values.category==="user"){
  values.details += 
         `${add_detail('fa-money',`${values.currency }: ${values.data_type[values.id].coins}`)} ${add_detail('fa-star',`Experience: ${values.data_type[values.id].xp}`)}`
  values.buttons = `<button onclick="accordion('Demo1')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Roles</button>
          <div id="Demo1" class="simple-hide simple-container">
            <p>${values.role_list }</p>
          </div>
          <button onclick="accordion('Demo2')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-heart fa-fw simple-margin-right"></i> Follows</button>
          <div id="Demo2" class="simple-hide simple-container">
            <p>Followers: ${values.follow_amount }</p>
            <p>Following: ${values.follow_list } </p>
            <p>Communities: ${values.community_list } </p>
          </div>`
  }
  return values;
}
  
  
function get_roles(){
  var roles = {}
  var i;
  var i2;
  var user;
  for (i = 0; i < Object.keys(database.user).length; i++) {
user = Object.keys(database.user)[i]//Get each user details
    for (i2 = 0; i2 < Object.keys(database.user[user].roles).length; i2++) {//Get each users roles
      if (!roles[database.user[user].roles[i2]]){roles[database.user[user].roles[i2]]=[]}
    if (!roles[database.user[user].roles[i2]].includes(user)){
      var usercap=user.charAt(0).toUpperCase()+user.slice(1);
      roles[database.user[user].roles[i2]].push(usercap);
    }
}
    
//delete data.user[user]["password"]
    
}
  return roles;
}

app.get("/u", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var username = request.query.search;
  var me = request.cookies['saved-username'];
  //if (!me){me = "null"}
  if (!username){if (me){username=me}else username='null'}
  if (typeof database.user[username] === "undefined") {return response.send(msg('no_account',null,'u'));}
  //var post_number, post_list,comment_number,comment_list,badge_number, badge_list,follow_number, follow_list,community_number,community_list,status,post_bar,comment_bar,profile_menu,side_bar,scripts;
  //post_number=post_list=comment_number=comment_list=badge_number=badge_list=follow_number=follow_list=community_number=community_list=status=post_bar=comment_bar=profile_menu=side_bar=scripts="";
  
  var values ={
    "username":username,
    "id":username,
    "category":"user",
    "background":request.cookies['saved-background'],
    "data_type":database.user,
    "password":request.cookies['saved-password'],
    "currency":currency,
    "me":me,
    "time":time,
    "anti":anti,
    "hostname":request.hostname,
    "post_number":0,"post_list":"",
    "comment_number":"","comment_list":"",
    "role_number":"","role_list":"",
    "follow_number":"","follow_list":"",
    "follow_amount":database.user[username].followers.length,
    "community_number":"","community_list":"",
    "like_number":"","like_list":"",
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
    "i":"",
    "details":"",
    "visible":{
    "logged_in":"",
    "logged_out":"hidden",
    "post_bar":"hidden"
  }
  }
social(values,database.user,"username")
  //var get = new main(database, mini,username,null,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar);
//response.send(get.u());
  var delete_passwords;
  //const data = Object.assign({}, database);
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
delete_passwords = Object.keys(data.user)[values.i]
delete data.user[delete_passwords]["password"]
}
response.render('page.ejs', { database: data,values:values});
});





app.get("/c", (request, response) => {
  //var params = request.protocol + "://" + request.headers.host + request.originalUrl;
  //var username = params.slice(params.search("username=")+9,Infinity).toLowerCase();
  var community = request.query.search;
  var me = request.cookies['saved-username'];
  //if (!me){me = "null"}
  if (!community){if (me){community=me}else community='null'}
  if (typeof database.user[community] === "undefined") {return response.send(msg('no_account',null,'u'));}
  //var post_number, post_list,comment_number,comment_list,badge_number, badge_list,follow_number, follow_list,community_number,community_list,status,post_bar,comment_bar,profile_menu,side_bar,scripts;
  //post_number=post_list=comment_number=comment_list=badge_number=badge_list=follow_number=follow_list=community_number=community_list=status=post_bar=comment_bar=profile_menu=side_bar=scripts="";
  var values ={
    "username":community,
    "id":community,
    "category":"community",
    "data_type":database.community,
    "password":request.cookies['saved-password'],
    "currency":currency,
    "me":me,
    "time":time,
    "anti":anti,
    "hostname":request.hostname,
    "post_number":0,"post_list":"",
    "comment_number":"","comment_list":"",
    "role_number":"","role_list":"",
    "follow_number":"","follow_list":"",
    "follow_amount":database.community[community].members.length,
    "community_number":"","community_list":"",
    "like_number":"","like_list":"",
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
    "i":"",
    "details":"",
    "visible":{
    "logged_in":"",
    "logged_out":"hidden",
    "post_bar":"hidden"
  }
  }
social(values,database.user,"username")
  //var get = new main(database, mini,username,null,currency,status,self_avatar,self_link,profile_menu,scripts,info_data,nav,nav_mobile,badge_list,follow_amount,follow_list,community_list,post_bar,post_list,side_bar);
//response.send(get.u());
  var delete_passwords;
  //const data = Object.assign({}, database);
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
delete_passwords = Object.keys(data.user)[values.i]
delete data.user[delete_passwords]["password"]
}
response.render('page.ejs', { database: data,values:values});
});






app.get("/d", (request, response) => {
  var username = request.query.username;
  var community = request.query.search;
  if (!username){if (request.cookies['saved-username']){username=request.cookies['saved-username']}else username='null'}
  if (typeof database.user[username] == "undefined") {return response.send(msg('no_account',null,'u'));}
  if (typeof database.community[community] == "undefined") {return response.send(msg('no_account',null,'u'));}
    var values ={
    "username":username,
    "community":community,
    "anti":anti,
    "post_number":"",
    "post_list":"",
    "comment_number":"",
    "comment_list":"",
    "role_number":"",
    "role_list":"",
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
    "logged_in":"",
    "logged_out":"hidden",
    "post_bar":"hidden"
  }
  }
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(request.cookies['saved-username']!==undefined){
    values.self_avatar=database.user[request.cookies['saved-username']].avatar;
    values.self_link=`/u?username=${request.cookies['saved-username']}`;
    status=`Logged in as: ${request.cookies['saved-username'].toUpperCase()}`;
    values.profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><a href="../dashboard" class="simple-bar-item simple-button">Dashboard</a><form method="POST" action="/logout"><button type="submit" class="simple-bar-item simple-button">Logout</button></form></div> `;
    values.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`
    
    if (bcrypt.compareSync(request.cookies['saved-password'],database.user[username].password)){
      values.visible.logged_in = "hidden";
      values.visible.logged_out = "";
      if(request.cookies['saved-username']==username){values.visible.post_bar = ``;}
  }
  }else{
    status='not logged in';
    values.profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;">
      <a href="#login" class="simple-bar-item simple-button">Login</a>
      <a href="#register" class="simple-bar-item simple-button">Register</a>
    </div> `
  };
  
  if(typeof database.user[request.cookies['saved-username']] !== "undefined"){
  if (!logs.views[username]){logs.views[username]=0;}
  logs.views[username]+=1;
  if (database.community[community].owner!==username){
  if (database.community[community].members.includes(username)){values.nav += `<a href="/connect?sent=${community}&method=join" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heartbeat"></i></a>`}else{
  values.nav += `<a href="/connect?sent=${community}&method=join" class="simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow"><i class="fa fa-heart"></i></a>`}
  }
  }
    if(typeof mini.thread[community] !== "undefined"){values.comment_list=``;
  for (values.post_number in mini.thread[community]) {
    if(typeof mini.thread[community][values.post_number] !== "undefined"){
    for (values.comment_number in mini.thread[community][values.post_number].comments){
      if (typeof database.user[mini.thread[community][values.post_number].comments[values.comment_number].sender] !== "undefined"){
      values.comment_list+=`<a>${mini.thread[community][values.post_number].comments[values.comment_number].sender}: ${mini.thread[community][values.post_number].comments[values.comment_number].text}</a><br>`
      }
    }
      if(request.cookies['saved-username']!==undefined){
      values.comment_bar=`<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-col m12"><div class="simple-card simple-round simple-white"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="method" value="new-thread-comment">
              <input type="hidden" name="sentcommunity" value="${community}">
              <input type="hidden" name="commentid" value="${values.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`
      }
    }
    values.like_list=0;for (values.like_number in mini.thread[values.community][values.post_number].likes){
      if (typeof database.community[mini.thread[values.community][values.post_number].likes[values.like_number]] !== "undefined"){
        values.like_list+=1;
      }
    }
    values.post_list +=  `<div class="simple-container simple-card simple-white simple-round simple-margin" id="post-${[values.post_number]}"><br>
        <img src="${`${database.user[mini.thread[community][values.post_number].sender].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px">
        <span class="simple-right simple-opacity">#${values.post_number}</span>
        <button class="simple-right simple-opacity" onclick="copy('https://${request.hostname}/c?search=${values.community}#post-${values.post_number}');notification('Link Copied!')">
        <i class="fa fa-link"></i>
        &nbsp;</button>
        
        <span class="simple-right simple-opacity" >
        <form method="post" action="/edit">
        <input type="hidden" name="method" value="like">
        <input type="hidden" name="type" value="thread">
        <input type="hidden" name="community" value="${values.community}">
        <input type="hidden" name="sentid" value="${values.post_number}">
        <button type="submit" onclick="notification('<3!')">
        <i class="fa fa-heart"></i>
        ${values.like_list}
        </button>
        </form></span>
        <br><b style="font-size: 2em;">&nbsp${database.user[mini.thread[community][values.post_number].sender].preferred}: </b>
        <a style="font-size: 1.5em;">${mini.thread[community][values.post_number].title} </a><br>
        <hr class="simple-clear">
        <p>${mini.thread[community][values.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="accordion('comments_${values.post_number}')" class="simple-button simple-block simple-theme-l1 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${values.post_number}" class="simple-hide simple-container">
            <p>${values.comment_list}${values.comment_bar}</p>
          </div>
      </div>` ;
    values.comment_list=``;
  }}
  var delete_passwords;
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
delete_passwords = Object.keys(data.user)[values.i]
delete data.user[delete_passwords]["password"]
}
response.render('c.ejs', { database: data,values:values});
});








app.get("/", function(request, response) {
  var values ={
    "username":"empty",
    "roles":get_roles(),
    "anti":anti,
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
    "nav":`<form method="get" action="/u" style="display:inline-block;"><input type="text" name="username" class="simple-border simple-padding" style="width:20vw;" placeholder="Find User"></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-search"></i> Search</button></form>`,
    "nav_mobile":"",
    "info_data":info_data,
    "visible":{
  }
  }
  for (values.i = 0; values.i < Object.keys(values.roles).length; values.i++) {
var role;
role = Object.keys(values.roles)[values.i]
    values.roles[role]=JSON.stringify(values.roles[role]).replace(/[,]+/g, ", ").replace(/[["\]]+/g, "");//;
    
}
  //if (request.query.notification){scripts+=`alert('${request.query.notification}');`}
  
  if(request.cookies['saved-username']!==undefined){
    if (typeof database.user[request.cookies['saved-username']] == "undefined") {return response.send(no_account_message+`<button onclick="location.replace('/user')">Find a different user.</button>`);}
    values.self_avatar=database.user[request.cookies['saved-username']].avatar;
    values.username=request.cookies['saved-username'];
    values.self_link=`/u?username=${request.cookies['saved-username']}`;
    values.status=`Logged in as: ${request.cookies['saved-username'].toUpperCase()}`;
    values.profile_menu=` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300px;right:0;top:51px;"><!--
      <form method="POST" action="/logout">
<button type="submit" class="simple-bar-item simple-button">Logout</button>
</form>-->
    </div> `
  }else{
    values.status='not logged in';
    values.profile_menu = ` <div class="simple-dropdown-content simple-card-4 simple-bar-block" style="width:300 px;right:0;top:51px;"><!--
      <a href="../u#login" class="simple-bar-item simple-button">Login</a>
      <a href="../u#register" class="simple-bar-item simple-button">Register</a>
-->
    </div> `
  };
  var delete_passwords;
  const data = JSON.parse(JSON.stringify(database));
  for (values.i = 0; values.i < Object.keys(data.user).length; values.i++) {
delete_passwords = Object.keys(data.user)[values.i]
delete data.user[delete_passwords]["password"]
}
response.render('slash.ejs', {database: data,values:values});

  
});
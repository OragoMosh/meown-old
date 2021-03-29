class all_values {
  constructor(values, database) {
    this.values = values;
    this.database = database;
    this.config = require('../server/config');
    this.function_pack = require('./tools/functionpack');
    this.bcrypt = require("bcryptjs");
  }

  value() {
    var values = this.values, database = this.database, config = this.config,function_pack = this.function_pack,bcrypt = this.bcrypt;
    
    values.post_number = 0;
    /*
    values.post_list = "";
    values.comment_number = "";
    values.comment_list = "";
    values.role_number = "";
    values.follow_number = "";
    values.follow_list = "";
    values.community_number = "";
    values.community_list = "";
    values.like_number = "";
    values.like_list = "";
    values.status = "";
    values.post_bar = "";
    values.comment_bar = "";
    values.profile_menu = "";
    values.side_bar = "";
    values.scripts = "";
    values.nav = "";
    values.nav_mobile = "";
    values.i = "";
    values.details = "";*/
    values.follow_amount = database.user[values.id]&&database.user[values.id].followers&&database.user[values.id].followers.length||0;
    values.self_avatar ="https://cdn.glitch.com/288a0b72-7e13-4dd2-bc7a-3cc2f4db2aab%2Fuser-slash.svg";
    values.self_link = "/u#login";
    
    varlist({
        variable:values,
        list:[
          "post_list","comment_number","comment_list","role_number","follow_number","follow_list",
          "community_number","community_list","like_number","like_list","status",
          "post_bar","comment_bar","profile_menu","side_bar","scripts",
          "nav","nav_mobile","i","details"
             ]
      })
    function varlist(vals){
if (!vals.variable&&!vals.list&&!vals.list[0])return;
vals.list.forEach(item => {vals.variable[item]=vals.value||""})
}

    function add_detail(values) {
  var result="";
  var i;
      for (i = 0; i < values.length; i++) {
  
  var icon = values[i].icon,
      text = values[i].value;
        
  if (!icon){icon = "fa-question-circle";}
  result+=`<p><i class="simple-theme-text-2 fa ${icon} fa-fw simple-margin-right"></i><span class="simple-theme-text-1">${text}</span></p>`;
  }
  return result;
}
  if (typeof values === "undefined") return "ERROR";
  if (!values.id){values.id = "username";}
  if (!values.category){values.id = "user";}
  if (!values.me){values.me = "null";}
  //var data_type;
  //if (values.category==="user"){data_type = database.user;}else
  //if (values.category==="community"){data_type = database.community;}else
  //{data_type=database.user}
    function getRole(username,category){
    var def = "#000000";
    var vals = {
      color:def,
      symbol:"",
      name:username,
      preferred: database[category][username].preferred
    };
    if (!database.user[username]){return vals;}
    if (!category)category==="community";
    if (category === "user"){
      for (var r = 0; r < Object.keys(config.role_info).length; r++) {
        
      var roleData = Object.keys(config.role_info)[r];
    if(database.user[username].roles.includes(roleData))
    {
      if (category=="user"&&config.role_info[roleData].color){vals.color = config.role_info[roleData].color;}
      
      if (config.role_info[roleData].symbol){
        vals.symbol = config.role_info[roleData].symbol;
        vals.name = `${username} ${config.role_info[roleData].symbol}`;
        vals.preferred = `${database.user[username].preferred} ${config.role_info[roleData].symbol}`;
      }
      else {vals.name = username;
            vals.preferred = database.user[username].preferred;
           }
      
      r=r+Object.keys(config.role_info).length;
    }
      }
    }
      console.log(vals)
      return vals;
    }
  if (values.me !== undefined) {

    values.self_avatar = database.user[values.me]&&database.user[values.me].avatar||"";
    values.self_link = `/u?username=${values.me}`;
    values.status = `Logged in as: ${values.me.toUpperCase()}`;
    
    values.profile_menu = `
    <a href="../dashboard" class="simple-bar-item simple-button">
    Dashboard
    </a>
    <form method="get" action="/logout"><button type="submit" class="simple-bar-item simple-button">Logout</button></form>`;
    
    values.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`;

    if (typeof values.password !== "undefined") {
      if (bcrypt.compareSync(values.password, database.user[values.me]&&database.user[values.me].password||" ")) {
        values.visible.postBar = ``;
        values.visible.loggedIn = ``;
        if (values.me&&values.me == values.id) values.visible.postBar = ``;
        else values.visible.postBar = `simple-hide`;
        if (values.me && values.me !== values.id && values.id !== "guest" &&values.id !== "null") {
    
    var join_type, connect_type;
    if (values.category === "user") {
      join_type = "following";
      connect_type = "follow";
    } else {
      join_type = "members";
      connect_type = "join";
    }
            
    if (database[values.category][values.id][join_type].includes(values.me)) {values.nav += `<a href="/connect?sent=${values.id}&method=${connect_type}" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Unfollow @${values.id}"><i class="fa fa-heartbeat"></i></a>`;}
     
    else {values.nav += `<a href="/connect?sent=${values.id}&method=${connect_type}" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow @${values.id}"><i class="fa fa-heart"></i></a>`;}
  }
      }
    }
    else
    {
          values.profile_menu = `
    <a href="/login" class="simple-bar-item simple-button">Login</a>
    <a href="/register" class="simple-bar-item simple-button">Register</a>
    `;
      values.visible.postBar = `simple-hide`;
    }
    if (values.category === "community") {
      if (database[values.category][values.id].members.includes(values.me)) {
        //DELETE ME
      }
    }
  }
      if (database[values.category][values.id]&&database[values.category][values.id].audio){
      values.post_list+=
        `<audio controls  id="audio" style="display:none;">
        <source src="${database[values.category][values.id].audio.url}" >
        Your browser does not support the audio element.
        <script>var audio = document.getElementById("audio");audio.volume = ${database[values.category][values.id].audio.volume};</script>
        </audio>`
      
      values.nav +=`
        <a id="play_audio" onclick="audio.currentTime = 1;audio.play();this.style.display='none';document.getElementById('stop_audio').style.display = 'block';" style="display:block;" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow @${values.id}"><i class="fa fa-volume-up"></i></a>
        <a id="stop_audio" onclick="audio.pause();this.style.display='none';document.getElementById('play_audio').style.display = 'block';" style="display:none;" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow @${values.id}"><i class="fa fa-stop"></i></a>
        `
      }
    
        var myroles = '';
    if (values.category === "user") {
      values.myroles = [];
      if (database[values.category][values.id].roles.length>0){
      database[values.category][values.id].roles.forEach(my_roles);
      function my_roles(role,index) {
        if (Object.keys(config.role_info).includes(role)) {values.myroles+= `${config.role_info[role].name}, `;}
      };
      }
      else values.myroles = "None"
      values.myroles = function_pack.fix_end(values.myroles)
    }


  var post_type = "posts";
  if (typeof database[values.category][values.id][post_type] !== "undefined") {
    values.comment_list = ``;
    values.post_number = database[values.category][values.id][post_type].length-1;
    var length = database[values.category][values.id][post_type].length-1;
    var max = function_pack.max(length,length-3+1);
    var num = database[values.category][values.id][post_type].length-function_pack.max(database[values.category][values.id][post_type].length,)-1;
    
    //console.log(length-this.function_pack.max(this.values.post_number,3))
    //console.log(this.values.post_number)
    //console.log(length-this.function_pack.max(length,3))
    while (values.post_number > length-function_pack.max(length+1,5)) {
      
      if (typeof database[values.category][values.id][post_type][values.post_number] !== "undefined") {

        for (values.comment_number in database[values.category][values.id][post_type][values.post_number].comments) {
          if (typeof database[values.category][database[values.category][values.id][post_type][values.post_number].comments[values.comment_number].username] !== "undefined") {
            values.comment_list += `
            <a>${database[values.category][values.id][post_type][values.post_number].comments[values.comment_number].sender}:
            ${database[values.category][values.id][post_type][values.post_number].comments[values.comment_number].text}</a>
            <br>`;
          }
        }
        if (values.me !== undefined) {
          values.comment_bar = `<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-theme-l5 simple-theme-border simple-col m12"><div class="simple-card simple-round"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="sentname" value="${values.me}"><input type="hidden" name="sentpass" value="${values.me}"><input type="hidden" name="method" value="new-post-comment"><input type="hidden" name="commentid" value="${values.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`;
        }
      }
      
      values.like_list = 0;
      for (values.like_number in database[values.category][values.id][post_type][values.post_number].likes) {
        if (typeof database.user[database[values.category][values.id][post_type][values.post_number].likes[values.like_number]] !== "undefined") {values.like_list += 1;}
      }
      var sender = values.id;
      if (values.category === "community" && database[values.category][values.id][post_type][values.post_number]&&database[values.category][values.id][post_type][values.post_number].username){sender = database[values.category][values.id][post_type][values.post_number].username}
      else if (values.category === "community"){sender = "Deleted User";}
      
      values.post_list += `
      <div class="simple-theme-l5 simple-theme-border simple-theme-text-1 simple-container simple-card simple-round simple-margin" id="post-${[length-values.post_number-1]}"><br>
        <img src="${`${database.user[sender].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px"> 
        <button class="simple-right simple-opacity" onclick='menu({type:"post",id:"${sender}",number:"${values.post_number}",category:"${values.category}",likes:"${values.like_list}"});'><i class="fa fa-bars"></i></button>
        <span class="simple-right simple-opacity"><i class="fa fa-heart" ></i>:${values.like_list}</span>&nbsp;
        <span class="simple-right simple-opacity">#${values.post_number}</span>
        
`;

      values.post_list +=`
        
        <br><b style="font-size: 2em;color:${getRole(sender,"user").color};">&nbsp${function_pack.caps(getRole(sender,"user").name)}: </b>
        <a style="font-size: 1.5em;">${
          database[values.category][values.id][post_type][values.post_number].title
        } </a><br>
        <hr class="simple-clear">
        <p>${database[values.category][values.id][post_type][values.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="javascript:toggleClass(document.getElementById('comments_${values.post_number}'),'simple-show');" class="simple-button simple-block simple-theme-l1 simple-theme-text-2 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${values.post_number}" class="simple-hide simple-container">
            <p>${values.comment_list}${values.comment_bar}</p>
          </div>
      </div>`;
      values.comment_list = ``;

      values.post_number--;
    }
  }

  if (typeof database[values.category][values.id].following !== "undefined") {
    if (database[values.category][values.id].following.length - 1 < 0){values.follow_list = "No One";}
    for (values.follow_number in database[values.category][values.id].following) {
      values.follow_list += `
      <span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/u?search=${database[values.category][values.id].following[values.follow_number]}');">${database[values.category][values.id].following[values.follow_number]}</span>`;
      if (database[values.category][values.id].following.length - 1 >values.follow_number&&database[values.category][values.id].following.length - 1 > 0)
        {values.follow_list += `, `;}
    }
  }
  
  if (typeof database[values.category][values.id].communities !== "undefined") {
    if (database[values.category][values.id].communities.length - 1 < 0) {values.community_list = "None";}
    for (values.community_number in database[values.category][values.id].communities) {
      values.community_list += `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/c?search=${database[values.category][values.id].communities[values.community_number]}');">${
        database[values.category][values.id].communities[values.community_number]
      }</span>`;
      if (database[values.category][values.id].communities.length - 1 >values.community_number&&database[values.category][values.id].communities.length - 1 > 0) 
          {values.community_list += `, `;}
    }
  }
  if (values.category === "community") {values.panelname = database[values.category][values.id].preferred;}
  else {values.panelname = function_pack.caps(getRole(values.id,values.category).preferred);}
  values.details = `
  <h4 class="simple-center" style="color:${getRole(values.id,values.category).color||"black"}">${values.panelname}</h4>
  <p class="simple-center">
  <img src="${database[values.category][values.id].avatar}" class="simple-circle" style="height:106px;width:106px;border: 2px solid ${getRole(values.id,values.category).color||"black"};" alt="User Avatar">
  </p>
  <hr>
  `;
    
    var date =new Date(Number(database[values.category][values.id].creation_date));
    
  values.stats=[
    {"icon":"fa-user","value":values.id},
    {"icon":"fa-birthday-cake","value":`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}
    ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`}
  ]
    
    if (values.category === "user"){values.stats.push(
    {"icon":"fa-money","value":Number(database[values.category][values.id].coins.toPrecision(2))},
    {"icon":"fa-star","value":database[values.category][values.id].xp})
                                        }
    
  values.details+=add_detail(values.stats);
  if (values.category === "user") {
    values.buttons = `<button onclick="javascript:toggleClass(document.getElementById('Demo1'),'simple-show');
    " class="simple-theme-l1 simple-theme-text-2 simple-button simple-block simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Roles</button>
          <div id="Demo1" class="simple-hide simple-container">
            <p>${values.myroles}</p>
          </div>
          <button onclick="javascript:toggleClass(document.getElementById('Demo2'),'simple-show');" class="simple-theme-l1 simple-theme-text-2 simple-button simple-block simple-left-align"><i class="fa fa-heart fa-fw simple-margin-right"></i> Follows</button>
          <div id="Demo2" class="simple-hide simple-container">
            <p>Followers: ${values.follow_amount}</p>
            <p>Following: ${values.follow_list} </p>
            <p>Communities: ${values.community_list} </p>
          </div>`;
  }
  return values;
  }//End of value()
  
}


module.exports = all_values;



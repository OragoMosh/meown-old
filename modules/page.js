class all_values {
  constructor(values, database) {
    this.values = values;
    this.database = database;
    this.config = require('../server/config');
    this.function_pack = require('./tools/functionpack');
    this.bcrypt = require("bcryptjs");
  }

  value() {
    var values = this.values, database = this.database, config = this.config,function_pack = this.function_pack;
    function add_detail(values) {
  var result="";
  var i;for (i = 0; i < values.length; i++) {
  
  var icon = values[i].icon;
  var text = values[i].value;
  if (!icon) {
    icon = "fa-question-circle";
  }
  result+=`<p><i class="simple-theme-text-2 fa ${icon} fa-fw simple-margin-right"></i><span class="simple-theme-text-1">${text}</span></p>`;
  }
  return result;
}
  if (typeof this.values === "undefined") {
    return "ERROR";
  }
  if (!this.values.id) {
    this.values.id = "username";
  }
  if (!this.values.category) {
    this.values.id = "user";
  }
  if (!this.values.me) {
    this.values.me = "null";
  }
  //var data_type;
  //if (values.category==="user"){data_type = database.user;}else
  //if (values.category==="community"){data_type = database.community;}else
  //{data_type=database.user}
    function get_role(username,category){
    var def = "#000000";
    var vals = {color:def,symbol:"",name:username}
    if (!database.user[username]){vals.color = def;}
    if (!category){category==="community"}
    if (category === "user"){
    var r;for (r = 0; r < Object.keys(config.role_info).length; r++) {
    if(database.user[username].roles.includes(Object.keys(config.role_info)[r]))
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
  if (values.me !== undefined) {

    this.values.self_avatar = this.database.user[this.values.me].avatar;
    this.values.self_link = `/u?username=${this.values.me}`;
    this.values.status = `Logged in as: ${this.values.me.toUpperCase()}`;
    
    this.values.profile_menu = `
    
    <a href="../dashboard" class="simple-bar-item simple-button">
    Dashboard
    </a>
    <form method="get" action="/logout">
    <button type="submit" class="simple-bar-item simple-button">Logout</button></form>`;
    
    this.values.nav_mobile += `<a href="../dashboard" class="simple-bar-item simple-button simple-padding-large">Dashboard</a>`;

    if (typeof this.values.password !== "undefined") {
      if (this.bcrypt.compareSync(this.values.password, database.user[values.me].password)) {
        /*this.values.visible.logged_in = "hidden";
        this.values.visible.logged_out = "";*/
        if (this.values.me == this.values.id) {
          this.values.visible.post_bar = ``;
        }
      }
    }else{
          this.values.profile_menu = `
    <a href="/login" class="simple-bar-item simple-button">Login</a>
    <a href="/register" class="simple-bar-item simple-button">Register</a>
    `;
    }
    if (this.values.category === "community") {
      if (this.values.data_type[this.values.id].members.includes(this.values.me)) {
        /*this.values.visible.logged_in = "hidden";
        this.values.visible.logged_out = "";
        this.values.visible.post_bar = ``;*/
      }
    }
  } /*else {
    this.values.status = "not logged in";
    this.values.profile_menu = `
    <a href="#login" class="simple-bar-item simple-button">Login</a>
    <a href="#register" class="simple-bar-item simple-button">Register</a>
    `;
  }*/
        var myroles = '';
    if (this.values.category === "user") {
      values.myroles = [];
      console.log("one");
      database["user"][values.id].roles.forEach(my_roles);
      console.log("two");
      function my_roles(role,index) {
        console.log("three");
        if (Object.keys(config.role_info).includes(role)){
          values.myroles+= `${config.role_info[role].name}, `
        }
      };
      //values.myroles = function_pack.fix_end(values.myroles)
    }
  if (this.values.me !== undefined && this.values.me !== this.values.id && this.values.id !== "guest" &&this.values.id !== "null") {
    
    var join_type, connect_type,myroles = '';
    if (this.values.category === "user") {
      join_type = "following";
      connect_type = "follow";
    } else {
      join_type = "members";
      connect_type = "join";
    }
    if (this.values.data_type[this.values.id][join_type].includes(this.values.me)) {
      this.values.nav += `<a href="/connect?sent=${this.values.id}&method=${connect_type}" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Unfollow @${this.values.id}"><i class="fa fa-heartbeat"></i></a>`;
    } else {
      this.values.nav += `<a href="/connect?sent=${this.values.id}&method=${connect_type}" class="simple-theme-text-favorite simple-bar-item simple-button simple-hide-small simple-padding-large simple-hover-white" title="Follow @${this.values.id}"><i class="fa fa-heart"></i></a>`;
    }
  }

  var post_type = "posts";
  /*if (this.values.category === "user") {
    post_type = "posts";
  } else {
    post_type = "thread";
  }*/
    
  if (typeof this.database[this.values.category][this.values.id][post_type] !== "undefined") {
    this.values.comment_list = ``;
    this.values.post_number = this.database[this.values.category][this.values.id][post_type].length-1;
    var length = this.database[this.values.category][this.values.id][post_type].length-1;
    var max = this.function_pack.max(length,length-3+1);
    var num = this.database[this.values.category][this.values.id][post_type].length-this.function_pack.max(this.database[this.values.category][this.values.id][post_type].length,)-1;
    
    //console.log(length-this.function_pack.max(this.values.post_number,3))
    //console.log(this.values.post_number)
    //console.log(length-this.function_pack.max(length,3))
    while (this.values.post_number > length-this.function_pack.max(length+1,5)) {
      
      if (typeof this.database[this.values.category][this.values.id][post_type][this.values.post_number] !== "undefined") {

        for (this.values.comment_number in this.database[this.values.category][this.values.id][post_type][this.values.post_number].comments) {
          if (typeof this.values.data_type[this.database[this.values.category][this.values.id][post_type][this.values.post_number].comments[this.values.comment_number].sender] !== "undefined") {
            this.values.comment_list += `
            <a>${this.database[this.values.category][this.values.id][post_type][this.values.post_number].comments[this.values.comment_number].sender}:
            ${this.database[this.values.category][this.values.id][post_type][this.values.post_number].comments[this.values.comment_number].text}</a>
            <br>`;
          }
        }
        if (this.values.me !== undefined) {
          this.values.comment_bar = `<form method="post" action="/edit">
<div class="simple-row-padding"><div class="simple-theme-l5 simple-col m12"><div class="simple-card simple-round"><div class="simple-container simple-padding">
              <hb class="simple-opacity">Add Comment</b>
              <input type="hidden" name="sentname" value="${this.values.me}">
              <input type="hidden" name="sentpass" value="${this.values.me}">
              <input type="hidden" name="method" value="new-post-comment">
              <input type="hidden" name="commentid" value="${this.values.post_number}">
              <input type="text" name="sentcomment" class="simple-border simple-padding" placeholder="Comment Input" required></input>
              <button type="submit" class="simple-button simple-theme"><i class="fa fa-pencil"></i> Send</button>
            </div></div></div></div>
</form>`;
        }
      }
      
      this.values.like_list = 0;
      for (this.values.like_number in this.database[this.values.category][this.values.id][post_type][this.values.post_number].likes) {if (typeof this.database.user[this.database[this.values.category][this.values.id][post_type][this.values.post_number].likes[this.values.like_number]] !== "undefined") {this.values.like_list += 1;}}
      var sender = this.values.id;if (this.values.category === "community" && this.database[this.values.category][this.values.id][post_type][this.values.post_number].sender){sender = this.database[this.values.category][this.values.id][post_type][this.values.post_number].sender}else if (this.values.category === "community"){sender = "Deleted User"}
      
      this.values.post_list += `<div class="simple-theme-l5 simple-theme-text-1 simple-container simple-card simple-round simple-margin" id="post-${[length-this.values.post_number-1]}"><br>
        <img src="${`${this.database.user[sender].avatar}`}" alt="User_Avatar" class="simple-circle" style="width:90px;height:90px"> 
        <span class="simple-right simple-opacity">#${this.values.post_number}</span>
        
        <button class="simple-right simple-opacity" onclick="copy('https://${this.values.hostname}/u?search=${this.values.id}#post-${this.values.post_number}');notification('Link Copied!')">
        <i class="fa fa-link"></i>
        &nbsp;</button>
        <span class="simple-right simple-opacity" >
        <form method="post" action="/edit">
        <input type="hidden" name="method" value="like">
        <input type="hidden" name="type" value="${post_type}">
        <input type="hidden" name="sentname" value="${this.values.id}">
        <input type="hidden" name="sentid" value="${this.values.post_number}">
        <button type="submit" onclick="notification('<3!')">
        <i class="fa fa-heart" ></i>
        ${this.values.like_list}
        </button>
        </form>
        &nbsp;</span>
        <br><b style="font-size: 2em;color:${get_role(sender,"user").color};">&nbsp${function_pack.caps(get_role(sender,"user").name)}: </b>
        <a style="font-size: 1.5em;">${
          this.database[this.values.category][this.values.id][post_type][this.values.post_number].title
        } </a><br>
        <hr class="simple-clear">
        <p>${this.database[this.values.category][this.values.id][post_type][this.values.post_number].body}</p>
        <hr class="simple-clear">
        <button onclick="accordion('comments_${
          this.values.post_number
        }')" class="simple-button simple-block simple-theme-l1 simple-theme-text-2 simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Comments</button>
          <div id="comments_${
            this.values.post_number
          }" class="simple-hide simple-container">
            <p>${this.values.comment_list}${this.values.comment_bar}</p>
          </div>
      </div>`;
      this.values.comment_list = ``;

      this.values.post_number--;
    }
  }

  if (typeof this.values.data_type[this.values.id].following !== "undefined") {
    if (this.values.data_type[this.values.id].following.length - 1 < 0) {
      this.values.follow_list = "No One";
    }
    for (this.values.follow_number in this.values.data_type[this.values.id].following) {
      this.values.follow_list += `
      <span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/u?search=${this.values.data_type[this.values.id].following[this.values.follow_number]}');">${this.values.data_type[this.values.id].following[this.values.follow_number]}</span>`;
      if (this.values.data_type[this.values.id].following.length - 1 >this.values.follow_number) {
        if (this.values.data_type[this.values.id].following.length - 1 > 0) {this.values.follow_list += `, `;}
      }
    }
  }
  
  if (typeof this.values.data_type[this.values.id].communities !== "undefined") {
    if (this.values.data_type[this.values.id].communities.length - 1 < 0) {this.values.community_list = "None";}
    for (this.values.community_number in this.values.data_type[this.values.id].communities) {
      this.values.community_list += `<span class="simple-tag simple-small simple-theme-d3" onclick="location.replace('/c?search=${this.values.data_type[this.values.id].communities[this.values.community_number]}');">${
        this.values.data_type[this.values.id].communities[this.values.community_number]
      }</span>`;
      if (this.values.data_type[this.values.id].communities.length - 1 >this.values.community_number) {
        if (this.values.data_type[this.values.id].communities.length - 1 > 0) {
          this.values.community_list += `, `;
        }
      }
    }
  }
  if (values.category === "community"){values.panelname = this.database[values.category][this.values.id].preferred}
  else {values.panelname = function_pack.caps(get_role(values.id,values.category).name);}
  this.values.details = `
  <h4 class="simple-center" style="color:${get_role(values.id,values.category).color}">${values.panelname}</h4>
  <p class="simple-center">
  <img src="${this.database[values.category][this.values.id].avatar}" class="simple-circle" style="height:106px;width:106px;border: 2px solid ${get_role(values.id,values.category).color};" alt="User Avatar">
  </p>
  <hr>
  `;
    
  this.values.stats=[
    {"icon":"fa-user","value":this.values.id},
    {"icon":"fa-birthday-cake","value":this.database[this.values.category][this.values.id].creation_date}
  ]
    
    if (this.values.category === "user"){this.values.stats.push(
    {"icon":"fa-money","value":Number(this.database[this.values.category][this.values.id].coins.toPrecision(2))},
    {"icon":"fa-star","value":this.database[this.values.category][this.values.id].xp})
                                        }
    
  this.values.details+=add_detail(this.values.stats);
  if (this.values.category === "user") {
    this.values.buttons = `<button onclick="accordion('Demo1')" class="simple-theme-l1 simple-theme-text-2 simple-button simple-block simple-left-align"><i class="fa fa-shield fa-fw simple-margin-right"></i> Roles</button>
          <div id="Demo1" class="simple-hide simple-container">
            <p>${values.myroles}</p>
          </div>
          <button onclick="accordion('Demo2')" class="simple-theme-l1 simple-theme-text-2 simple-button simple-block simple-left-align"><i class="fa fa-heart fa-fw simple-margin-right"></i> Follows</button>
          <div id="Demo2" class="simple-hide simple-container">
            <p>Followers: ${this.values.follow_amount}</p>
            <p>Following: ${this.values.follow_list} </p>
            <p>Communities: ${this.values.community_list} </p>
          </div>`;
  }
  return this.values;
  }
  
}


module.exports = all_values;



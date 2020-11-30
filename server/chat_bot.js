/* \/ Required node modules, DO NOT DELETE. \/ */
const http = require('http');
const express = require('express');
const Discord = require("discord.js");const client = new Discord.Client();
const fs = require("fs");
const app = express();
const Canvas = require('canvas');
const bcrypt= require("bcryptjs");
const config = require('../config.json');
/* /\ End /\ */

/* \/ Sync from database \/ */
/*This can be changed but make sure all the variables are still correct*/
const database_location = __dirname+"/database.json";
const mini_location = __dirname+"/mini.json"
const database = JSON.parse(fs.readFileSync(database_location));
const mini = JSON.parse(fs.readFileSync(mini_location));
/* |\/ - These should be left alone.|*/
let botver = config.mainbot_ver;
let creator_id = config.creator_id;
let creator_name = config.creator_id;
var hostname = config.url;
var prefix = config.prefix;
var defaultprefix = config.default_prefix;

/* /\ End /\ */

/* \/ Custom Variables \/ */
var eprefix = prefix+" ";
let beprefix = " "+eprefix;
var commandlist = [`Page 1:\n**${beprefix}help** - Show's more info.\n**${beprefix}vapor** - Create's a vaporwave background with someone's profile.\n**${beprefix}prefix** - Show's the server's prefix.\n**${beprefix}clear <amount>** - Clear's a specific amount of messages Ex. `+eprefix+'`clear 50`'+`.\n**${beprefix}cat** - Sends a random cat image.\n**${beprefix}kawaii**\n**${beprefix}me**\n**${beprefix}filter <on, off>** - Enable's / Disable's swearing Ex. \`${eprefix} filter on\`\n`];
function fish_chance(){
  return (Math.floor((Math.random() * 10) + 1) *.05 * Math.floor((Math.random() * 5) + 0)).toFixed(2);
}

/* /\ End /\ */

/* \/ Time conversion tool \/ */
function ms_seconds(x){ return x / 1000;}
function ms_minutes(x){ return x / 1000;}

/* /\ End /\ */
function save_database(){
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
}
setInterval(save_database, 600000);
/* \/ Important \/ */
app.use(express.static('public'));
app.listen(3002);

client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
/* /\ End /\ */

//setInterval(() => {http.get(`http://mittz-bot.glitch.me/`);}, 280000);
/*
function save_database(){
  fs.writeFileSync(database_location, JSON.stringify(database, null, 2));
}
setInterval(save_database, 240000);
*/
client.on("message", async (message) => {
  //if (url_check(message.content)){message.delete();message.author.send('Please do not use url\'s in this server!')}
  
  if (message.author.bot) return;
  if (message.content.startsWith('chat up')) {
    message.delete();message.reply('Yep').then(msg => {msg.delete({ timeout: 5000 })});
   }

  function connect_message(){
    return message.reply(`You don't have an account connected yet,\n please use the command ${eprefix}connect <username> <password>\n to connect your account, if you do not have an account please register one at
https://${hostname}/register`).then(msg => {msg.delete({ timeout: 6000 })});
  }

      const args = message.content.slice(eprefix.length).trim().split(' ');
const command = args.shift().toLowerCase();
    if (command){
      var username;
  if (message.channel.type === "text") {if (!message.guild.me.hasPermission("EMBED_LINKS")){message.channel.send("Please enable Embed Links for me.").then(msg => {msg.delete({ timeout: 5000 })});}}
  if (command==="balance") {
    if (!database.user[database.discord[message.author.id]]){return message.channel.send('ERROR, Cannot find user!')}
    if (!database.discord[message.author.id]){return connect_message()};
    const exampleEmbed = {
    color: 0x0099ff,
    title: 'Coin Balance',
    fields: [{name:message.author.username+'\'s balance.',value: database.user[database.discord[message.author.id]].coins}],
};
  message.channel.send({ embed: exampleEmbed }).then(msg => {msg.delete({ timeout: 5000 })})
}

 if (command==="profile") {
   if (args[0]){username=args[0]}else{username=database.discord[message.author.id]}
   if (!database.profiles.includes(username)){message.channel.send("There is no user with this name").then(msg => {msg.delete({ timeout: 5000 })})};
   const embed = {
    title: `${database.user[username].preferred}'s profile`,
     description: `Description: ${database.user[username].description}`,
     thumbnail: {
		url: database.user[username].avatar,
	},
    fields: [
      {name:message.author.username+'\'s balance.',value: database.user[username].coins},
      {name:'__Real-Name__',value: username},
      {name:'__Coins__',value: database.user[username].coins},
      {name:'__Experience__',value: database.user[username].xp},
      {name:'__Account created on__',value: database.user[username].creation_date}
            ],
    color: database.user[username].color,
     timestamp: new Date(),
	footer: {
		text: `${client.user.username} | By: Orago`,
		icon_url: 'https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664',
	},
};
   message.channel.send({embed: embed})//.then(msg => {msg.delete({ timeout: 5000 })});
  }
      if (command === 'mine') {
        if (!database.discord[message.author.id]){return connect_message()};
        database.user[database.discord[message.author.id]].coins+=.05
        message.channel.send(`You have mined a coin and now have ${database.user[database.discord[message.author.id]].coins} Coins.`).then(msg => {msg.delete({ timeout: 2000 })})
      }
      if (command === 'fish') {
        if (!database.discord[message.author.id]){return connect_message();};
        var fish = Number(fish_chance)
        console.log(`${fish_chance}\n${fish}\n${fish_weight}`)
        if (Number(fish)<0.01){return message.channel.send(`Your fish got away!`);}
        else{var fish_weight = Number(fish)*10;
          message.channel.send(`Your caught a ${fish_weight}lb fish and sold it for ${fish}coins`);
          database.user[database.discord[message.author.id]].coins+=fish;
             
        return }
        message.channel.send(`You have mined a coin and now have ${database.user[database.discord[message.author.id]].coins} Coins.`).then(msg => {msg.delete({ timeout: 2000 })})
      }

       if (command === 'posts') {
         if (!args[0]){
           if (!database.profiles.includes(database.discord[message.author.id])){return message.channel.send(`Please connect an account or include an input field Ex. \`${eprefix}posts <username>\``)}
           else{args[0]=database.discord[message.author.id]}
         }
         if (args[0]){username=args[0]}else{username=database.discord[message.author.id]}
   if (!database.profiles.includes(username)){return message.channel.send("There is no user with this name").then(msg => {msg.delete({ timeout: 5000 })})};
         var post_number, post_list = "";
   if(typeof mini.posts[username] !== "undefined"){
  for (post_number in mini.posts[username]) {
    post_list +=  `#${post_number}: ${mini.posts[username][post_number]}` ;
    if([mini.posts[username].length-1] > 0){post_list += `\n`};
  }}
   const embed = {
     author: {
		name: username+'\'s Posts.',
		icon_url: database.user[username].avatar,
		url: `https://meown.tk/u/?username=${username}`,
	},
     /*thumbnail: {
		url: database.user[username].avatar,
	},*/
    fields: [
      {name:'__|__',value: post_list}
            ],
    color: database.user[username].color,
     timestamp: new Date(),
	footer: {
		text: `${client.user.username} | By: Orago`,
		icon_url: 'https://cdn.glitch.com/65f81ac1-5972-4a88-a61a-62585d79cfc0%2Fboxie-2048px.png?v=1594354728664',
	},
};
   message.channel.send({embed: embed})//.then(msg => {msg.delete({ timeout: 4000 })});
  }
      
  if (message.content==(eprefix + "help")||message.content==("mc! help")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Information__')
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+client.user.username+'.\nI can provide fun commands, run a small economy, have a decent amount of other utility features. \nUse `'+eprefix+'connect <username> <password>` in my direct messages to connect to your account.')
        .setColor(config.color)
        .addField('__Developer__', '<@193127888646701056>', true)
        .addField('__Library__', 'Discord.js', true)
        .addField('__Server Count__', client.guilds.cache.size, true)
        .addField('__User Count__', client.users.cache.size, true)
        .addField('__Channel Count__', client.channels.cache.size, true)
        .addField(`__Create an Account at__`, 'https://meown.tk/u#register', true)
        .addField('__Memory Usage__', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
        .addField('__Prefix__', prefix, true)
        .setFooter(`${client.user.username} | By: Orago`)
      message.channel.send(embed).then(msg => {msg.delete({ timeout: 10000 })});
  }
  
 if (message.content==(eprefix + "commands")||message.content==("mc! commands")||message.content==(eprefix+" commandlist")||message.content==("!v! commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist, true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed).then(msg => {msg.delete({ timeout: 10000 })});
   message.reply('``A list of commands has been sent to your direct messages.``').then(msg => {msg.delete({ timeout: 4000 })});;
  }
  

    /* \/ DM COMMANDS \/ */
  if (message.channel.type === "dm") {

    if (command === 'connect') {
    if (!args.length) {return message.channel.send(`You didn't provide any arguments, ${message.author}! Command Useage: \nEx. ${eprefix}connect username123 password321`);}
	else if (args[0]) {
    
    if (!args[1]) {
      return message.reply('You haven\'t given a password input!').then(msg => {msg.delete({ timeout: 4000 })}); 
    }
    if (database.discord[message.author.id]){return message.reply("You already have an account connected").then(msg => {msg.delete({ timeout: 4000 })})};
    if (!database.profiles.includes(args[0].toLowerCase())){return message.channel.send('There is no account with this name!'+args[0]+":"+database.profiles).then(msg => {msg.delete({ timeout: 3000 })})}
    
    if (database.profiles.includes(args[0].toLowerCase())) {
    message.channel.send('Real Account, now verifying password..').then(msg => {msg.delete({ timeout: 4000 })});
          if (bcrypt.compareSync(args[1],database.user[args[0].toLowerCase()].password)){
          database.discord[message.author.id]=args[0];
          message.channel.send(`Connection Successful!\n Account connected: '${database.discord[message.author.id]}'`).then(msg => {msg.delete({ timeout: 8000 })});
        } else {message.channel.send('Incorrect Password!').then(msg => {msg.delete({ timeout: 4000 })});}
  } 
	}
    }
      
      if (message.content.startsWith("mittz")) {message.channel.send("Ready when you are!").then(msg => {msg.delete({ timeout: 15000 })}).catch(console.error);}
      //else message.channel.send('This is not a valid Command').then(msg => {msg.delete({ timeout: 4000 })}); 
    }
    
    
    
  }
  /* /\ End of "DM COMMANDS" /\ */
  

  /* /\ End of "All Commands" /\ */
});




function getUserFromMention(mention) {
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return client.users.cache.get(mention);
	}
}



client.on("guildDelete", guild => {
  
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});


/*client.on("ready", async () => {
  //client.user.setUsername("Mittz");
  console.log('Ready!')
  client.user.setPresence({ activity: { name: `${eprefix} help | ${client.guilds.cache.size} guilds`,type: "STREAMING",url:"https://www.youtube.com/watch?v=P4i-VYcrEuc"}, status: 'idle'});
});*/



//client.login(process.env.bot_token);
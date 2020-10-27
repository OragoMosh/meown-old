/* \/ Required node modules, DO NOT DELETE. \/ */
const http = require('http');
const express = require('express');
const Discord = require("discord.js");const client = new Discord.Client();
const fs = require("fs");
const app = express();
const Canvas = require('canvas');
const config = require('./config.json');

/* /\ End /\ */

/* \/ Sync from database \/ */
/*This can be changed but make sure all the variables are still correct*/
const database_location = __dirname+"/database.json";
const database = JSON.parse(fs.readFileSync(database_location));
/* |\/ - These should be left alone.|*/
let botver = config.mainbot_ver;
let creator_id = config.creator_id;
let creator_name = config.creator_id;
let homepage = config.homepage;
let support_url = config.support_url;
var prefix = config.prefix;
var defaultprefix = config.default_prefix;
const swears = database.swears;
/* /\ End /\ */

/* \/ Custom Variables \/ */
var eprefix = prefix+" ";
let beprefix = " "+eprefix;
var commandlist = [`Page 1:\n**${beprefix}help** - Show's more info.\n**${beprefix}vapor** - Create's a vaporwave background with someone's profile.\n**${beprefix}prefix** - Show's the server's prefix.\n**${beprefix}clear <amount>** - Clear's a specific amount of messages Ex. `+eprefix+'`clear 50`'+`.\n**${beprefix}cat** - Sends a random cat image.\n**${beprefix}kawaii**\n**${beprefix}me**\n**${beprefix}filter <on, off>** - Enable's / Disable's swearing Ex. \`${eprefix} filter on\`\n`];
/* /\ End /\ */

/* \/ Time conversion tool \/ */
function ms_seconds(x){ return x / 1000;}
function ms_minutes(x){ return x / 1000;}
/* /\ End /\ */

/* \/ Important \/ */
app.use(express.static('public'));
app.listen(process.env.PORT);
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200); 
});

client.on('shardError', error => {
	 console.error('A websocket connection encountered an error:', error);
});
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
/* /\ End /\ */

function url_check(str) {
     var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
     var url = new RegExp(urlRegex, 'i');
     return str.length < 2083 && url.test(str);
}
let discordInvite = /(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i;
  

//setInterval(() => {http.get(`http://mittz-bot.glitch.me/`);}, 280000);

client.on("message", async (message) => {
  //if (url_check(message.content)){message.delete();message.author.send('Please do not use url\'s in this server!')}
  
  if (message.author.bot) return;
  
  
  
  if (message.content.startsWith('chat up')) {
    message.delete();message.reply('Yep').then(msg => {msg.delete({ timeout: 5000 })});
   }

  function profile_card(user_type){
        const canvas = Canvas.createCanvas(700, 250);
       const ctx = canvas.getContext('2d');
       Canvas.loadImage(database.background[user_type.id]).then((background) => {
         ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
           Canvas.loadImage(user_type.avatarURL({ format: "png", dynamic: true })).then((pfp) => {
             Canvas.loadImage('https://cdn2.iconfinder.com/data/icons/actions-states-vol-1-colored/48/JD-13-512.png').then((xp) => {
               Canvas.loadImage('https://www.stickpng.com/assets/images/585e4beacb11b227491c3399.png').then((lb) => {
                  Canvas.loadImage('https://cdn.discordapp.com/attachments/660390332772646922/744094457317818388/discordowner.svg').then((owner) => {
                   Canvas.loadImage('https://discordapp.com/assets/ccebe0b729ff7530c5e37dbbd9f9938c.svg').then((rich) => {
                      let leaderboard = database.xp
                      const ordered = {};
                      Object.keys(leaderboard).sort().forEach(function(key) {
                         ordered[key] = leaderboard[key];
                      });
                     
                     ctx.drawImage(xp, 225, 90, 50, 50);
                     ctx.drawImage(lb, 40, 205, 30, 30);

                     if (database.badges[user_type.id].includes("rich")) {
                       ctx.drawImage(rich, 320, 147, 40, 40);
                     }
                     if (message.author.id===message.guild.ownerID) {
                       ctx.drawImage(owner, 185, 50, 55, 40);
                     }
                     ctx.font = '40px sans-serif';
                     ctx.fillStyle = database.color[user_type.id];
                     ctx.fillText(`${user_type.tag}`, 240, 90);
                     ctx.font = '25px sans-serif';
                     ctx.fillText(`${database.xp[user_type.id]}xp`, 270, 125);
                     ctx.fillText(`${database.coins[user_type.id]} coins`, 270, 170);
                     ctx.fillText(`Bio: ${database.description[user_type.id]}`, 77, 229);
                      ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(110, 125, 75, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
                     ctx.drawImage(pfp, 30, 45, 150, 150);
                     const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'profile.png');
                     message.channel.send(`Here is your profile, ${user_type.tag}!`, attachment);
                   })
                 })
               })
             })
       })
       })
  }
  
  if (message.content.startsWith(eprefix + 'profile')) {
  if (!message.mentions.users.size) {
		return profile_card(message.author);
	}
	const avatarList = message.mentions.users.map(user => {
profile_card(user)
	});

  }
  

      
     

  
  if (message.content==(eprefix + "help")||message.content==("!v! help")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        .setTitle('__'+client.user.username+' Information__')
        .setDescription('Hello! <:gold:733213975705026620> I\'m '+client.user.username+'.\nI can do lots of things like play audio from a few radio channels, help moderate a server, provide fun commands, run a small economy, and have a decent amount of other utility features. \nUse `'+eprefix+'commandlist` to see what other things i can do.')
        .setColor(config.color)
        .addField('__Developer__', '<@193127888646701056>', true)
        .addField('__Library__', 'Discord.js', true)
        .addField('__Server Count__', client.guilds.cache.size, true)
        .addField('__User Count__', client.users.cache.size, true)
        .addField('__Channel Count__', client.channels.cache.size, true)
        .addField(`__Creator's Homepage__`, 'https://mittens.glitch.me', true)
        .addField('__Memory Usage__', `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`, true)
        .addField('__Prefix__', prefix, true)
        .setFooter(`${client.user.username} | By: Orago`)
      message.channel.send(embed);
  }
  
 if (message.content==(eprefix + "commands")||message.content==("!v! commands")||message.content==(eprefix+" commandlist")||message.content==("!v! commandlist")) {
    const embed = new Discord.MessageEmbed()
        .setThumbnail(client.user.avatarURL)
        .setTitle('__'+client.user.username+' Commands__')
        .setDescription('Hello! <:gold:733213975705026620>')
        .addField('__Command List 1__', commandlist, true)
        .setColor(config.color)
        .setFooter(`${client.user.username} | By: Orago`)
      message.author.send(embed);
   message.reply('``A list of commands has been sent to your direct messages.``');
  }
  
  if (message.channel.type === "text") {
  var kargs = message.content.split(" ").slice(1);
if (message.content.startsWith(eprefix + "balance")) {
  if (message.channel.type !== "text") {return message.channel.send('Please do this in a server with `'+client.user.username+'`')}
  var registered = false;
  //if (!server.servers.includes(message.guild.id)&&!server.profiles.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup` then set up your profile with`"+eprefix+"self setup`");
  if (!database.profiles.includes(message.author.id)){return message.channel.send("Please setup "+client.user.username+" economy with `"+eprefix+"self setup`")}
  const user = getUserFromMention(kargs[1]);
  if (kargs[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  if (database.servers.includes(message.guild.id)){var registered = true;}
if (!database.profiles.includes(person.id)){return message.channel.send(`Please ask the user @ ${person.username} to setup `+client.user.username+`economy with `+"`"+eprefix+`self setup`+"`")}
var embed = new Discord.MessageEmbed()
        .setThumbnail(message.author.avatarURL({ format: 'jpg' }))
        .setTitle(`__Guild and ${person.username}'s kawaii leaderboard__`)
        .setDescription(`Here are the scores and validity`)
        .setColor(config.color)
        /*.addField(`__Guild__`, ".", true)
        .addField(`__owo's__`, server.owo[message.guild.id], true)
        .addField(`__uwu's__`, server.uwu[message.guild.id], true)*/
        .addField(`__Self__`, ".", true)
        .addField(`__Coins__`, database.owo[person.id], true)
        .addField(`__uwu's__`, database.uwu[person.id], true)
        .addField(`__registered__`, registered, true)
        .setFooter(`${client.user.username} | By: Orago`)
    message.channel.send(embed)
}

if (message.content.startsWith(eprefix + "account")) {
  var registered = false;
  if (!database.servers.includes(message.guild.id)&&!database.profiles.includes(message.author.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup` then set up your profile with`"+eprefix+"self setup`");
  if (!database.profiles.includes(message.author.id)){return message.channel.send("Please setup "+client.user.username+" economy with `"+eprefix+"self setup`")}
  const user = getUserFromMention(kargs[1]);
  if (kargs[1]) {
		if (!user) {
			return message.reply('Please use a proper mention if you want to see someone else\'s avatar.');
		}
		var person = user;
	} else
var person = message.author;
  if (database.servers.includes(message.guild.id)){var registered = true;}
if (!database.profiles.includes(person.id)){return message.channel.send(`Please ask the user @ ${person.username} to setup `+client.user.username+`economy with `+"`"+eprefix+`self setup`+"`")}
var embed = new Discord.MessageEmbed()
        embed.setThumbnail(client.user.avatarURL({ format: "png", dynamic: true }))
        embed.setTitle(`__Guild and ${person.username}'s kawaii leaderboard__`)
        embed.setDescription(`Here are the scores and validity`)
        embed.setColor(config.color)
        embed.addField(`__coin's__`, server.coins[person.id], true)
        embed.addField(`__exp__`, server.xp[person.id], true)
        embed.addField(`__owo's__`, server.owo[person.id], true)
        embed.addField(`__uwu's__`, server.uwu[person.id], true)
        embed.setFooter(`${client.user.username} | By: Orago`)
    message.channel.send(embed)
}

  
  function self_setup(){
    if (!database.servers.includes(message.guild.id)) return message.channel.send("Please ask the server owner to setup "+client.user.username+" economy with `"+eprefix+"guild setup`");
   if (database.profiles.includes(message.author.id)) return message.channel.send(":closed_lock_with_key: **Whoops!** You already have a profile!");
  message.channel.send("**:unlock: Beep Boop Beep! We're setting up your profile!**").then(msg=>{
       database.profiles.push(message.author.id)
        database.owo[message.author.id]=0;
        database.coins[message.author.id]=0;
        database.uwu[message.author.id]=0;
        database.background[message.author.id] = "https://convertingcolors.com/plain-2C2F33.svg"
        database.description[message.author.id] = 'No Description Set'
        database.color[message.author.id] = "#ffffff"
        database.badges[message.author.id]=[]
        database.xp[message.author.id]=0
       fs.writeFileSync("servers.json", JSON.stringify(database, null, 2));
       setTimeout(()=>{
         msg.edit(":lock: **Your user has been added.** View the leaderboard with "+eprefix+"`prof`.")
    },1500)
  })
  }
    
  if (message.content==(eprefix+"self setup")) {
    self_setup();
}

  }

  
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



client.login(process.env.bot_token);
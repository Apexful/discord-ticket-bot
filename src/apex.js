const Discord = require("discord.js");
const ms = require("ms");

const apex = new Discord.Client();

const cfg = require('./config.json');
if(!cfg) return console.log(`Please create a file called "config.json"`);

let prefix = cfg.prefix;
let token = cfg.token;

apex.on('ready', async () =>  {
  console.log(`Ready!`);
});

apex.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(cfg.prefix)) return;
  let command = message.content.split(' ')[0].slice(cfg.prefix.length);
  let args = message.content.split(' ').slice(1);

  if(command === "new") {
    let user = message.author;
    let role = message.guild.roles.find(r => r.name === "Support");

    let server = message.guild;

    message.guild.createChannel(`ticket-${message.author.discriminator}`, 'text', [
      {
        id: server.id,
        deny: ['READ_MESSAGES']
      },
      {
        id: user.id,
        allow: ['READ_MESSAGES']
      },
      {
        id: role.id,
        allow: ['READ_MESSAGES']
      }
    ]).then(c => {
      user.send(`Your ticket has been created successfully; view it here: ${c}`)

      let response = new Discord.RichEmbed()
      .setColor(message.guild.me.displayHexColor)
      .setTitle(`Hello, ${message.author.tag}`, message.author.displayAvatarUrl)
      .setDescription(`Please be patient as you await a response from staff. Please describe your situation briefly.`)
      .setFooter(`Apex#9307`);

      c.send(response)
    })
  }
  if(command === "add") {
    if(message.channel.name.startsWith("ticket-")) {
      let user = message.mentions.users.first() || apex.users.get(args[0]);
      if(!user) return;

      message.channel.overwritePermissions(user.id, {
        'READ_MESSAGES': true
      })
      return message.channel.send(`${user} has been added to; ${message.channel}`)
    }
  }
  if(command === "remove") {
    if(message.channel.name.startsWith("ticket-")) {
      let user = message.mentions.users.first() || apex.users.get(args[0]);
      if(!user) return;

      message.channel.overwritePermissions(user.id, {
        'READ_MESSAGES': null
      })
      return message.channel.send(`${user} has been removed from; ${message.channel}`)
    }
  }
  if(command === "close") {
    if(message.channel.name.startsWith("ticket-")) {
      let channel = message.channel;
      let delay = '5';

      setTimeout(function(){
        channel.delete()
    }, ms(delay));
    }
  }
})



apex.login(token);

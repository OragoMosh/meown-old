var fetch = require('node-fetch');
module.exports = {
    config:{
      "webhookUrl":"https://discord.com/api/webhooks/828490174119411753/3AEbR7FBp5AFOvgWffzqf8BJ6G3Pa4pEk-Q6wrFCK0BAePWJqHht1FcU-0W5obQXD8HK"||"",
      "username":"",
      "avatar_url":"",
      "content":"",
      "embeds":[]
    },
    send: function() {
      var config = this.config;
    fetch(config.webhookUrl,
  {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: config.username,
      avatar_url:config.avatar_url,
      content:config.content,
      allowed_mentions: {
        parse: ['users', 'roles'],
      },
      embeds: config.embeds
    }),
  }
);
    }
};
# discordCaptcha
Straightforward discord captcha system.

When a user joins, they will be DM'd a message containing a captcha. Failure to solve to solve the captcha correctly or within the timeout period will result in the user being kicked.
The bot requires kick, view channels, send messages, and read message permissions. For simplicity's sake, I would recommend just giving it administrator.

* Default prefix: <

### Commands:
* help/info - Display customizations of your bot and commands.
* setTimeout - Set the time a user has to solve the captcha after joining before being kicked.
* setPrefix - Set the bots prefix.

#### Set process.env.token to your bot token. To run the bot through command prompt, run `$env:token="yourBotToken"` before running `node index.js`

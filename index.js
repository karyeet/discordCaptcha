'use strict'

const fs = require('fs')

const discord = require("discord.js")
const client = new discord.Client()


//save
const servers = JSON.parse(fs.readFileSync("./servers.json"))

function saveServerData(){
    fs.writeFileSync("./servers.json",JSON.stringify(servers))
}
//

client.on("ready",()=>{
    console.log("Bot is ready.")
})

client.login(process.env.token)

client.on("guildCreate",(guild)=>{
    servers[guild.id]={}
})

client.on("guildDelete",(guild)=>{
    servers[guild.id]=null
})

client.on("message",(msg)=>{

})
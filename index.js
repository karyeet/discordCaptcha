'use strict'

const fs = require('fs')

const discord = require("discord.js")
const client = new discord.Client()
const litEmbed = require('./litEmbeds.js')
const { Console } = require('console')

const emojis = JSON.parse(fs.readFileSync('./captchaEmojis.json'))
//save
const servers = JSON.parse(fs.readFileSync("./servers.json"))

function saveServerData(){
    fs.writeFileSync("./servers.json",JSON.stringify(servers))
}
//

function commandCheck(command, message, Prefix){
	var command = command.toLowerCase();
	var content = message.content.toLowerCase();
	return content.startsWith(Prefix + command);
}

client.on("ready",()=>{
    console.log("Bot is ready.")
})

client.login(process.env.token)

client.on("guildCreate",(guild)=>{
    console.log('Guild Joined.')
    servers[guild.id]={"Prefix":'<'}
})

client.on("guildDelete",(guild)=>{
    console.log('Guild Left.')
    servers[guild.id]=null
})

client.on("message",async (msg)=>{
    if(msg.author.bot || !msg.guild){return}
    const Prefix = servers[msg.guild.id].Prefix



    /*if(!msg.guild || !msg.guild.available){
        await msg.guild.fetch()
        console.log('fetched a guild')
    }*/


    if(commandCheck('testcaptcha',msg, Prefix)){
        const captchaEmbed = new litEmbed()
        captchaEmbed.setTitle('Captcha!')
        captchaEmbed.setDesc('The server you just joined is protected by a Captcha! If you answer wrong or wait too long before solving, you will be kicked.')
    
        const selectedEmoji = Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)]
        const selectedEmojiPlacement = Math.floor(Math.random() * 6)

        captchaEmbed.addField('Click the...', selectedEmoji[0].toLowerCase()+'.')
    
        const sentmsg = await msg.member.send(captchaEmbed.embed)

        for (let i = 0; i<6;i++){
            if(i==selectedEmojiPlacement){
                sentmsg.react(selectedEmoji[1])
            }else{
                sentmsg.react(Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)][1])
            }
        }

    }
})

client.on("guildMemberAdd",async (member)=>{
    console.log('User Joined.')
    const kickTimeout = setTimeout(()=>{
        if(member.kickable){
            member.kick('Did not solve Captcha.')
        }
    },1000*60*2)

    const captchaEmbed = new litEmbed()
    captchaEmbed.setTitle('Captcha!')
    captchaEmbed.setDesc('The server you just joined is protected by a Captcha! If you answer wrong or wait too long before solving, you will be kicked.')

    const seletectedEmoji = Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)]
    const selectedEmojiPlacement = Math.floor(Math.random() * 6)

    captchaEmbed.addField('Click the...', seletectedEmoji[0].toLowerCase()+'.')

    
    const sentmsg = await msg.member.send(captchaEmbed.embed)

    for (let i = 0; i<6;i++){
        if(i==selectedEmojiPlacement){
            sentmsg.react(seletectedEmoji[1])
        }else{
            sentmsg.react(Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)][1])
        }
    }
    
})
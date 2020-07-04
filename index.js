'use strict'

const fs = require('fs')

const discord = require("discord.js")
const client = new discord.Client()
const litEmbed = require('./litEmbeds.js')

const defaultEmbed = new litEmbed()
defaultEmbed.setColor(11631177)
defaultEmbed.setDefault()

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
    servers[guild.id]={"Prefix":'<',"Timeout":120}
})

client.on("guildDelete",(guild)=>{
    console.log('Guild Left.')
    servers[guild.id]=null
})

client.on("message",async (msg)=>{
    if(msg.author.bot || !msg.guild){return}

    if(!msg.guild.available){
        await msg.guild.fetch()
        console.log('Fetched a guild')
    }

    const args = msg.content.split(' ')
    const Prefix = servers[msg.guild.id].Prefix
    
    if(commandCheck('credits',msg,Prefix)||commandCheck('credits',msg,'<')){
        msg.member.send('Created by <@257438782654119937> and can be found at https://github.com/KareemRS/discordCaptcha')
        return
    }

    if(commandCheck('help',msg,Prefix)||commandCheck('help',msg,'<')||commandCheck('info',msg,Prefix)||commandCheck('info',msg,'<')){
        const helpEmbed = new litEmbed()
        helpEmbed.setTitle('Captchad Commands')
        helpEmbed.setDesc('Prefix: `'+Prefix+'`')

        helpEmbed.addField('help',`Shows help list.
        \`${Prefix}help\``)//help

        helpEmbed.addField('credits',`Shows author & github.
        \`${Prefix}credits\``)//credits

        helpEmbed.addField('changetimeout',`Changes the seconds a user has to solve a captcha before being kicked. Default: 120 seconds. (Guild Owner Only)
        \`${Prefix}changetimeout 120\``)//changetimeout

        helpEmbed.addField('setPrefix',`Changes the prefix for commands. Default: < (Guild Owner Only)
        \`${Prefix}setprefix <\``)//setPrefix

        msg.member.send(helpEmbed.embed)
        return
    }


    if(!msg.member.id===msg.member.guild.ownerID){return} //all commands after here will not work unless the user is the server owner.

    if(commandCheck('settimeout',msg,Prefix)){
        console.log(args)
        if(!isNaN(Number(args[1]))){
            servers[msg.guild.id].Timeout=Number(args[1])
            saveServerData()
            msg.reply(`Timeout set to \`${args[1]}\`.`)
        }else{
            msg.reply('Argument 1 must be a number.')
        }
        return
    }

    if(commandCheck('setprefix',msg,Prefix)){
        console.log(args)
        if(args[1]){
            servers[msg.guild.id].Prefix=args[1]
            saveServerData()
            msg.reply(`Prefix set to \`${args[1]}\`.`)
        }else{
            msg.reply('Argument 1 required.')
        }
        return
    }

    if(commandCheck('testcaptcha',msg, Prefix)){ //deprecated
        const captchaEmbed = new litEmbed()
        captchaEmbed.setTitle('Captcha!')
        captchaEmbed.setDesc('The server you just joined is protected by a Captcha! If you answer wrong or wait too long before solving, you will be kicked.')
        captchaEmbed.setAuthor(msg.member.guild.name,msg.member.guild.iconURL)

        const selectedEmoji = Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)]
        const selectedEmojiPlacement = Math.floor(Math.random() * 6)

        captchaEmbed.addField('Click the...', selectedEmoji[0].toLowerCase()+'.')
    
        const sentmsg = await msg.member.send(captchaEmbed.embed)

        let randomEmoji

        for (let i = 0; i<6;i++){
            if(i==selectedEmojiPlacement){
                console.log('selectedEmoji',selectedEmoji)
                sentmsg.react(selectedEmoji[1])
            }else{
                randomEmoji = Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)]
                console.log(randomEmoji)
                sentmsg.react(randomEmoji[1])
            }
        }

    }
})


client.on("guildMemberAdd",async (member)=>{
    if(member.user.bot){return}
    console.log('User Joined.')

    const captchaEmbed = new litEmbed()
    captchaEmbed.setTitle('Captcha!')
    captchaEmbed.setDesc('The server you just joined is protected by a Captcha! If you answer wrong or wait too long before solving, you will be kicked.')
    captchaEmbed.setAuthor(member.guild.name,member.guild.iconURL)

    const selectedEmoji = Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)]
    const selectedEmojiPlacement = Math.floor(Math.random() * 6)

    captchaEmbed.addField('Click the...', selectedEmoji[0].toLowerCase()+'.')

    const sentmsg = await member.send(captchaEmbed.embed)

    const kickTimeout = setTimeout(()=>{
        if(member.kickable){
            member.kick('Did not solve Captcha.')
        }
        sentmsg.edit(':x: Failed :( !')
    },1000*servers[member.guild.id].Timeout)

    sentmsg.captchadEmoji = {"emoji":selectedEmoji[1],"kickTimeout":kickTimeout}
    sentmsg.guildmember = member
    pendingReactionMessages[sentmsg.id] = sentmsg

    for (let i = 0; i<6;i++){
        if(i==selectedEmojiPlacement){
            sentmsg.react(selectedEmoji[1])
        }else{
            sentmsg.react(Object.entries(emojis)[Math.floor(Math.random() * Object.entries(emojis).length)][1])
        }
    }


    
})

const pendingReactionMessages = {} //organizd by message id

client.on("messageReactionAdd",(reaction,user)=>{
    if(user.bot){return}
    if(pendingReactionMessages[reaction.message.id]){
       //console.log(pendingReactionMessages[reaction.message.id].captchadEmoji,reaction.emoji.name)
        if(pendingReactionMessages[reaction.message.id].captchadEmoji.emoji==reaction.emoji.name){
            clearTimeout(pendingReactionMessages[reaction.message.id].captchadEmoji.kickTimeout)
            pendingReactionMessages[reaction.message.id]=null
            reaction.message.edit(':white_check_mark: Success!')
        }else{
            clearTimeout(pendingReactionMessages[reaction.message.id].kickTimeout)
            if(pendingReactionMessages[reaction.message.id].guildmember.kickable){
                pendingReactionMessages[reaction.message.id].guildmember.kick()
                console.log(user.username,'answered incorrectly.')
                reaction.message.edit(':x: Failed :( !')
                //reaction.message.reactions.removeAll()
                pendingReactionMessages[reaction.message.id]=null
            }
        }
    }
})
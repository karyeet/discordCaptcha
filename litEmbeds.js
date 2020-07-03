/**
 * For use in Discord bots.
 * Free for use in the public domain.
 * 
 * Kareem#3520 @discord.com
 * KareemRS @github.com
 */

'use strict';
let defaultEmbed = {embed:{}}


class litEmbed{
  constructor(message){
    this.embed = JSON.parse(JSON.stringify(defaultEmbed))
    this.embed.embed.timestamp = new Date()
    if (message){
      this.embed.embed.footer = {"text":message.author.username+'#'+message.author.discriminator,"icon_url":message.author.avatarURL}
    }else{this.embed.embed.footer={}}
    this.embed.embed.author = []
    this.embed.embed.fields = []
  }
  setDefault(){
    defaultEmbed = this.embed
  }

  setTitle(title,url){
    this.embed.embed.title = title
    this.embed.embed.url = url
  }
  setDesc(desc){
    this.embed.embed.description = desc
  }
  setColor(color){
    this.embed.embed.color = color
  }
  setTimestamp(timestamp){
    this.embed.embed.timestamp = timestamp
  }
  setFooter(text,url){
    this.embed.embed.footer.text = text
    this.embed.embed.footer.icon_url = url
  }
  setThumb(url){
    this.embed.embed.thumbnail = {url:url}
  }
  setImage(url){
    this.embed.embed.image = {url:url}
  }
  setAuthor(name,icon,url){
    this.embed.embed.author = {name:name,icon_url:icon,url:url}
    /*this.embed.embed.author.name = name
    this.embed.embed.author.icon_url = icon
    this.embed.embed.author.url = url*/
  }
  addField(name,value,inline){
    if(!inline){inline=false}
    this.embed.embed.fields.push({name:name,value:value,inline:inline})
  }
}



module.exports = litEmbed
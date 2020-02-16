import Discord from 'discord.js';
import Logger from './Logger';
import { guildId, botId } from '../config';
import { isNull } from 'util';
import _ from '../i18n/Language';

export default class Command {
  prefix: string = '';
  validCommand: Array<string> = new Array(
    'rmall');
  regexValidation: RegExp = new RegExp(`^\\*\\w{3}`);
  regexImg: RegExp = new RegExp(`(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`);
  talkedRecently: Set<any> = new Set();
  commandeTimeout: number = 500;

  constructor(private bot: Discord.Client) {
    let expression = '(';
    this.validCommand.forEach(aCommand => {
      expression += aCommand + '|';
    });
    expression = expression.substr(0, expression.length - 1);
    expression += ')';
    (this.prefix !== '')
      ? this.regexValidation = new RegExp(`^\\${this.prefix}${expression}`, 'i')
      : this.regexValidation = new RegExp(`^` + expression, 'i');
  }

  onListening(message: Discord.Message) {
    if (this.isTrueCommand(message)) {
      if (this.talkedRecently.has(message.author.id)) {
        message.channel.send(`${_('warnCommandSpam')} ${message.author}`)
          .then(message => { (message as Discord.Message).delete(3000); });
      } else {
        const messageToTableau = message.content.split(' ');
        const command = messageToTableau[0].substr(this.prefix.length, message.content.length + 1);
        const options: Array<string> = messageToTableau.splice(1);
        Logger.warn(`${message.author.username} ${message.author} call > ${command} ${options}`);

        switch (command) {

          case 'rmall':
            this.cmdRemoveMessages(message);
            break;

          default:
            break;
        }
        // User add to timeout list
        this.talkedRecently.add(message.author.id);
        setTimeout(() => {
          // after 4 sec, remove the user from the user cooldown list
          this.talkedRecently.delete(message.author.id);
        }, this.commandeTimeout);
      }
    }
  }


  isTrueCommand(message: Discord.Message) {
    return this.regexValidation.test(message.content);
  }


  async cmdRemoveMessages(message: Discord.Message) {
    if (message.channel.type === 'dm') {
      const fetched = await message.channel.fetchMessages({ limit: 99 });
      fetched.forEach(message => {
        if (message.author.id === botId) {
          message.delete();
        }
      });
    }

    if (message.channel.type === 'text') {
      const fetched = await message.channel.fetchMessages({ limit: 99 });
      message.channel.bulkDelete(fetched);
    }
  }

  getTextChannelByMention(mentionTextChannel: string): Discord.TextChannel | undefined {
    // a reference to a channel can be of type
    // <#HERE_ID> if it is mentioned in one of the server's channels
    // #MyChannel if it is mentioned in DM on the bot
    if (mentionTextChannel.startsWith('#')) {
      // #MyChannel
      const pureMention = mentionTextChannel.substr(1, mentionTextChannel.length + 1);
      const resultSearch: Discord.Channel | null = this.bot.channels.find((channel) => (channel as Discord.TextChannel).name === pureMention);
      if (!isNull(resultSearch)) {
        if (resultSearch.type === 'dm' || resultSearch.type === 'text') {
          return resultSearch as Discord.TextChannel;
        }
      }
    } else {
      // <#20892480924>
      const almostMentionId = mentionTextChannel.substr(2, mentionTextChannel.length + 1);
      const pureMentionId = almostMentionId.substr(0, almostMentionId.length - 1);
      const resultSearch = this.bot.channels.get(pureMentionId);
      if (resultSearch !== undefined) {
        if (resultSearch.type === 'dm' || resultSearch.type === 'text') {
          return resultSearch as Discord.TextChannel;
        }
      }
    }
    return undefined;
  }

  async getDMChannelByAuthor(authorID: string): Promise<Discord.DMChannel | undefined> {
    const member = this.bot.users.get(authorID);
    if (member !== undefined) {
      return await member.createDM();
    }
    return undefined;
  }

  isRoleMention(nameOfRoleMention: string) {
    const guild = this.bot.guilds.get(guildId) as Discord.Guild;
    let isFound = false;
    guild.roles.forEach(roles => {
      console.log(roles.name);
      if (roles.name === nameOfRoleMention) isFound = true;
    });
    return isFound;
  }

  matchAll(string: string, regex: RegExp): Array<string> {
    const matches = new Array();
    let matche;
    while ((matche = regex.exec(string)) !== null) {
      matches.push(matche[0]);
    }
    return matches;
  }

  getMembersById(authorId: string): Discord.GuildMember | undefined {
    return (this.bot.guilds.get(guildId) as Discord.Guild).members.get(authorId);
  }
}

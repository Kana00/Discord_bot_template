import Discord from 'discord.js';
import chalk from 'chalk';
import moment from 'moment';
import * as fs from 'fs';
import { isUndefined } from 'util';
import LogMessageDAO from '../dao/LogMessageDAO';


export default class Logger {

  static writeText(text: string) {
    fs.appendFileSync(`./logs/log.txt`, text);
  }

  static info(message: string) {
    const date = `[Info ${moment().format('DD/MM/YYYY HH:mm:ss')}]`;
    const dateColored = `[${chalk.blue('Info')} ${chalk.yellow(moment().format('DD/MM/YYYY HH:mm:ss'))}]`;
    console.log(`${dateColored} ${chalk.white(message)}`);
    Logger.writeText(`${date} ${message}` + '\n');
  }

  static warn(message: string) {
    const date = `[Info ${moment().format('DD/MM/YYYY HH:mm:ss')}]`;
    const dateColored = `[${chalk.blue('Info')} ${chalk.yellow(moment().format('DD/MM/YYYY HH:mm:ss'))}]`;
    console.log(`${dateColored} ${chalk.yellow(message)}`);
    Logger.writeText(`${date} ${message}` + '\n');
  }

  static logMessage(message: Discord.Message) {
    const mentionMembers: Array<string> = new Array();
    if (message.mentions.members !== null) {
      if (message.mentions.members.array().length) {
        message.mentions.members.array().forEach((memberMention) => {
          mentionMembers.push(memberMention.id);
        });
      }
    }


    const mentionRoles: Array<string> = new Array();
    if (message.mentions.roles !== null) {
      if (message.mentions.roles.array().length) {
        message.mentions.roles.array().forEach((mentionRole) => {
          mentionRoles.push(mentionRole.id);
        });
      }
    }

    const mentionUsers: Array<string> = new Array();
    if (message.mentions.users !== null) {
      if (message.mentions.users.array().length) {
        message.mentions.users.array().forEach((mentionUser) => {
          mentionUsers.push(mentionUser.id);
        });
      }
    }

    const messageSaveInformation = {
      authorId: message.author.id,
      displayAvatarURL: message.author.displayAvatarURL,
      tagUser: message.author.tag,
      userName: message.author.username,
      channelId: message.channel.id,
      channelType: message.channel.type,
      channelName: (message.channel.type === 'dm') ? 'privateDM' : (message.channel as Discord.TextChannel).name,
      messageContent: message.cleanContent,
      date: message.createdAt,
      hit: message.hit,
      messageId: message.id,
      displayName: (message.member === null) ? null : message.member.displayName,
      nickName: (message.member === null) ? null : message.member.nickname,
      onVoiceChannelID: (message.member === null) ? null : message.member.voiceChannelID,
      mentionUsers: mentionUsers,
      mentionMembers: (message.member === null) ? null : mentionMembers,
      mentionRoles: mentionRoles,
      mentionEveryHere: message.mentions.everyone,
      urlToJump: message.url
    }
    LogMessageDAO.saveToDB(messageSaveInformation);

    const date = `[Time ${moment().format('DD/MM/YYYY HH:mm:ss')}]`;
    const dateColored = `[${chalk.blue('Time')} ${chalk.yellow(moment().format('DD/MM/YYYY HH:mm:ss'))}]`;

    const thisChannel = (isUndefined((message.channel as Discord.TextChannel).name)) ? `Private DM` : (message.channel as Discord.TextChannel).name;

    const member = `[${message.author.username} : ${thisChannel}]`;
    const memberColored = `${chalk.black.bgYellow.bold(' ' + message.author.username + ' ')}${chalk.black.bgBlue.bold(' ' + thisChannel + ' ')}`;

    const ids = `[Aut:${message.author.toString()} Chan:${message.channel.id}]`;
    const idsColored = `[Aut:${chalk.green(message.author.toString())} Chan:${chalk.green(message.channel.id)}]`;
    console.log(`${dateColored} ${idsColored}\n${memberColored} > ${chalk.black.bgGreen.bold(' ' + message.content + ' ')}`);
    Logger.writeText(`${date} ${ids}\n${member} > ${message.content}` + '\n');
  }
}

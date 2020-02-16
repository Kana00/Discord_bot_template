/*

██████╗ ██╗███████╗ ██████╗ ██████╗ ██████╗ ██████╗
██╔══██╗██║██╔════╝██╔════╝██╔═══██╗██╔══██╗██╔══██╗
██║  ██║██║███████╗██║     ██║   ██║██████╔╝██║  ██║
██║  ██║██║╚════██║██║     ██║   ██║██╔══██╗██║  ██║
██████╔╝██║███████║╚██████╗╚██████╔╝██║  ██║██████╔╝
╚═════╝ ╚═╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝

██████╗  ██████╗ ████████╗
██╔══██╗██╔═══██╗╚══██╔══╝
██████╔╝██║   ██║   ██║
██╔══██╗██║   ██║   ██║
██████╔╝╚██████╔╝   ██║
╚═════╝  ╚═════╝    ╚═╝

-> generator of ASCII Text : http://patorjk.com/software/taag/#p=display&f=ANSI%20Shadow&t=Discord%0ABot
-> Permission generator : https://discordapi.com/permissions.html
-> Discord developer site : https://discordapp.com/developers/applications

*/


import * as Discord from 'discord.js';
import Logger from './utils/Logger';
import { TOKEN, guildId } from './config';
import Command from './utils/Command';
import * as moment from 'moment';


// -------------------------------------------------------------------- configuration
const bot = new Discord.Client();
bot.login(TOKEN);
moment.locale('en');
const commandsHandler = new Command(bot);
bot.on('ready', async () => {
  Logger.warn('---------- bot START ! ----------');
  if (process.env.NODE_ENV === 'dev') Logger.warn('########## DÉVELOPPEMENT ##########');
  bot.user.setActivity('SET ACTIVITY HERE');
});

// SIGNAL fin de programme
process.on('SIGINT', async () => {
  process.stdout.write('\n');
  Logger.warn(`---------- bot STOP ----------`);
  bot.removeAllListeners();
  await bot.destroy();
  process.removeAllListeners();
  process.exit();
});

// -------------------------------------------------------------------- EVENTS
bot.on('guildCreate', (guild) => {
  // Prevent the bot from joining another guild
  if (guild.id !== guildId) {
    guild.leave();
  }
});

bot.on('guildMemberAdd', membre => {
  membre.sendMessage(`Welcome to our server ${membre.displayName} 🙂`);
  Logger.info(`${membre.displayName} -> new member`);
});

bot.on('message', (message) => {
  // Security: do not interpret messages from the bot itself as a potential command
  if (message.author.bot) {
    return;
  }

  Logger.logMessage(message);
  commandsHandler.onListening(message);
});

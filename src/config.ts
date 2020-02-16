// Edit this informations
export const TOKEN = (process.env.NODE_ENV === 'dev')
  ? 'YOUR TOKEN FOR DEVELOPPER BOT'
  : 'YOUR TOKEN FOR PRODUCTION BOT';

export const botId = 'ID OF THE BOT';

// If you want to register the bot to only one discord server, put its id here
export const guildId = 'ID OF THE DISCORD SERVER';


// throw error if this file is not edited
// @ts-ignore
if(TOKEN === 'YOUR TOKEN FOR DEVELOPPER BOT' && botId === 'ID OF THE BOT' && guildId === 'ID OF THE DISCORD SERVER' ) {
  throw new Error('You must complete the "RootDirectoryProject/src/config.ts" file to initialize the bot');
}

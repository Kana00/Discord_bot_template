# Discord bot Template

![build state](https://img.shields.io/badge/build-passing-green)

![Preview_bot](./assets/images/Preview_bot.png)

## Installation
MacOS Users:

```sh
# install Database
> brew install mongodb-community
# start Database
> brew services start mongodb-community
```

```sh
# install global tools
> sudo yarn global add npx cross-env typescript pm2
# install requiered moduls
> yarn install
```

## use pm2

pm2 allow you to use 100% of your CPU(s)

```sh
> pm2 start ./dist/start.js --name DiscordBot
> pm2 start yarn --name discord_bot
> pm2 restart start -- startdev
> pm2 ls
> pm2 stop INDEX
> pm2 log
> pm2 monit
```

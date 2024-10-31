const { logger } = require('./logger');
const { Queue } = require('discord-player');
const { prefix } = require('../../config/config.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'commandHandler',
  run: async (client, message, args) => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const commandName = args.shift().toLowerCase();

    const command =
      client.commands.get(commandName) ||
      client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command) return;

    if (command.voiceChannel && !message.member.voice.channel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription(
              'You need to be in a voice channel to use this command!'
            )
            .setColor('RED'),
        ],
      });
    }

    try {
      await command.run(client, message, args);
    } catch (error) {
      console.error(`Error executing command: ${command.name}`, error);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setDescription('There was an error executing that command.')
            .setColor('RED'),
        ],
      });
    }
  },
};
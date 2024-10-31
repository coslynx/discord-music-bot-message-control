const { Queue } = require('discord-player');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'volume',
  aliases: ['vol'],
  description: 'Adjusts the playback volume.',
  usage: 'volume [percentage]',
  voiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There is no music playing.').setColor('RED')] });
    }

    const volume = parseInt(args[0]);

    if (!volume) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription(`The current volume is ${queue.volume  100}%`).setColor('BLUE')] });
    }

    if (volume < 0 || volume > 100) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('The volume must be between 0% and 100%').setColor('RED')] });
    }

    queue.setVolume(volume / 100);

    return message.channel.send({ embeds: [new MessageEmbed().setDescription(`Volume set to ${volume}%`).setColor('GREEN')] });
  },
};
const { MessageEmbed } = require('discord.js');
const { Queue } = require('discord-player');

module.exports = {
  name: 'skip',
  aliases: ['next'],
  description: 'Skips the current song.',
  usage: 'skip',
  voiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There is no music playing.').setColor('RED')] });
    }

    if (!queue.playing) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('No music is currently playing.').setColor('RED')] });
    }

    queue.skip();
    return message.channel.send({ embeds: [new MessageEmbed().setDescription(`Skipped the current song: ${queue.current.title}`).setColor('GREEN')] });
  },
};
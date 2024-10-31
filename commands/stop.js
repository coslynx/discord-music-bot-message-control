const { MessageEmbed } = require('discord.js');
const { Queue } = require('discord-player');

module.exports = {
  name: 'stop',
  aliases: ['leave'],
  description: 'Stops the current music and leaves the voice channel.',
  usage: 'stop',
  voiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There is no music playing.').setColor('RED')] });
    }

    queue.stop();

    return message.channel.send({ embeds: [new MessageEmbed().setDescription('Stopped the music and left the voice channel.').setColor('GREEN')] });
  },
};
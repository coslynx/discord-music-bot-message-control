const { MessageEmbed } = require('discord.js');
const { Queue } = require('discord-player');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'Shows the current music queue.',
  usage: 'queue',
  voiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There is no music playing.').setColor('RED')] });
    }

    if (!queue.tracks[0]) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There are no songs in the queue.').setColor('RED')] });
    }

    const tracks = queue.tracks.slice(0, 10).map((track, i) => {
      return `${i + 1}. [${track.title}](${track.url}) - ${track.author}`;
    });

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle('Current Queue:')
      .setDescription(tracks.join('\n'))
      .setFooter({ text: `Currently playing: ${queue.current.title}`, iconURL: queue.current.thumbnail });

    return message.channel.send({ embeds: [embed] });
  },
};
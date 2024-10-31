const { MessageEmbed } = require('discord.js');
const { Queue } = require('discord-player');
const { prefix } = require('../../config/config.js');

module.exports = {
  name: 'play',
  aliases: ['p'],
  description: 'Plays a song from a URL or search query.',
  usage: 'play [URL | search query]',
  voiceChannel: true,
  run: async (client, message, args) => {
    const queue = client.player.getQueue(message.guild);

    if (!queue) {
      // If there's no queue, create one
      try {
        const song = await client.player.search(args.join(' '), {
          requestedBy: message.author,
        }).then((x) => x.tracks[0]);

        if (!song) {
          return message.channel.send({ embeds: [new MessageEmbed().setDescription(`No results found for ${args.join(' ')}`).setColor('RED')] });
        }

        client.player.play(message.member.voice.channel, song, {
          member: message.member,
          metadata: {
            channel: message.channel,
          },
        });

        const embed = new MessageEmbed()
          .setColor('GREEN')
          .setDescription(`Now playing: [${song.title}](${song.url})`);

        return message.channel.send({ embeds: [embed] });
      } catch (err) {
        // Handle search errors
        console.error('Error while searching or playing music:', err);
        return message.channel.send({ embeds: [new MessageEmbed().setDescription('There was an error playing the song.').setColor('RED')] });
      }
    }

    // If there's a queue, add the song
    try {
      const song = await client.player.search(args.join(' '), {
        requestedBy: message.author,
      }).then((x) => x.tracks[0]);

      if (!song) {
        return message.channel.send({ embeds: [new MessageEmbed().setDescription(`No results found for ${args.join(' ')}`).setColor('RED')] });
      }

      queue.add(song);

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setDescription(`Added [${song.title}](${song.url}) to the queue.`);

      return message.channel.send({ embeds: [embed] });
    } catch (err) {
      // Handle search or queue errors
      console.error('Error while searching or adding to queue:', err);
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('There was an error adding the song to the queue.').setColor('RED')] });
    }
  },
};
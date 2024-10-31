const { Client, VoiceState } = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  once: false,
  run: async (client, oldState, newState) => {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    // Check if the user joined a voice channel
    if (!oldChannel && newChannel) {
      // Get the voice channel and the queue
      const voiceChannel = newState.channel;
      const queue = client.player.getQueue(voiceChannel.guild);

      // If there's no queue, create one
      if (!queue) {
        // Check if the bot is already in a voice channel
        if (voiceChannel.guild.me.voice.channel) {
          // Leave the current voice channel
          voiceChannel.guild.me.voice.channel.leave();
        }

        // Try to create a new queue
        try {
          client.player.createQueue(voiceChannel.guild, {
            metadata: {
              channel: voiceChannel.guild.channels.cache.get(voiceChannel.guild.systemChannelId),
            },
          });
        } catch (error) {
          console.error(`Error creating queue: ${error}`);
        }
      }

      // Get the queue again after potential creation
      const queue = client.player.getQueue(voiceChannel.guild);

      // If there is a queue and it's not playing, start playing the first song
      if (queue && !queue.playing) {
        try {
          queue.play();
        } catch (error) {
          console.error(`Error playing queue: ${error}`);
        }
      }
    }

    // Check if the user left a voice channel
    if (oldChannel && !newChannel) {
      // Get the voice channel and the queue
      const voiceChannel = oldState.channel;
      const queue = client.player.getQueue(voiceChannel.guild);

      // If there's a queue and the bot is the only one left, leave the voice channel
      if (queue && voiceChannel.members.size === 1) {
        try {
          queue.stop();
        } catch (error) {
          console.error(`Error stopping queue: ${error}`);
        }
      }
    }
  },
};
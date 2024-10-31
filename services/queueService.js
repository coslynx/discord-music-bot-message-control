const { Queue } = require('discord-player');
const { logger } = require('../utils/logger');

class QueueService {
  /
    Creates a new queue for a server.
   
    @param {string} serverId - The ID of the server.
    @param {string} voiceChannelId - The ID of the voice channel to join.
    @returns {Promise<Queue>} - The newly created queue object.
   /
  async createQueue(serverId, voiceChannelId) {
    try {
      // Get the voice channel
      const voiceChannel = await this.getVoiceChannel(voiceChannelId);

      // Create the queue
      const queue = await this.player.createQueue(voiceChannel.guild, {
        metadata: {
          channel: voiceChannel,
        },
      });

      // Set the volume
      queue.setVolume(0.5); // Default volume

      logger.info(`Queue created for server ${serverId} in voice channel ${voiceChannelId}`);
      return queue;
    } catch (error) {
      logger.error(`Error creating queue: ${error.message}`);
      throw error;
    }
  }

  /
    Gets the voice channel object.
   
    @param {string} voiceChannelId - The ID of the voice channel.
    @returns {Promise<VoiceChannel>} - The voice channel object.
   /
  async getVoiceChannel(voiceChannelId) {
    try {
      const voiceChannel = await this.client.channels.fetch(voiceChannelId);
      return voiceChannel;
    } catch (error) {
      logger.error(`Error getting voice channel: ${error.message}`);
      throw error;
    }
  }

  /
    Adds a song to the queue.
   
    @param {string} serverId - The ID of the server.
    @param {string} songUrl - The URL of the song to add.
    @returns {Promise<Queue>} - The updated queue object.
   /
  async addSongToQueue(serverId, songUrl) {
    try {
      // Get the queue for the server
      const queue = await this.getQueue(serverId);

      // Add the song to the queue
      const song = await this.player.search(songUrl, {
        requestedBy: this.client.user,
      }).then((x) => x.tracks[0]);

      if (!song) {
        throw new Error(`No results found for ${songUrl}`);
      }

      queue.add(song);

      logger.info(`Song ${songUrl} added to queue for server ${serverId}`);
      return queue;
    } catch (error) {
      logger.error(`Error adding song to queue: ${error.message}`);
      throw error;
    }
  }

  /
    Gets the queue object for a server.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<Queue>} - The queue object.
   /
  async getQueue(serverId) {
    try {
      const queue = await this.player.getQueue(serverId);
      return queue;
    } catch (error) {
      logger.error(`Error getting queue: ${error.message}`);
      throw error;
    }
  }

  /
    Plays the queue for a server.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<void>} - A void promise.
   /
  async playQueue(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue.playing) {
        await queue.play();
        logger.info(`Playing queue for server ${serverId}`);
      }
    } catch (error) {
      logger.error(`Error playing queue: ${error.message}`);
      throw error;
    }
  }

  /
    Skips the current song in the queue.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<void>} - A void promise.
   /
  async skipSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);
      await queue.skip();
      logger.info(`Skipped song in queue for server ${serverId}`);
    } catch (error) {
      logger.error(`Error skipping song: ${error.message}`);
      throw error;
    }
  }

  /
    Stops the queue for a server.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<void>} - A void promise.
   /
  async stopQueue(serverId) {
    try {
      const queue = await this.getQueue(serverId);
      await queue.stop();
      logger.info(`Stopped queue for server ${serverId}`);
    } catch (error) {
      logger.error(`Error stopping queue: ${error.message}`);
      throw error;
    }
  }

  /
    Sets the volume for the queue.
   
    @param {string} serverId - The ID of the server.
    @param {number} volume - The volume percentage (0-100).
    @returns {Promise<void>} - A void promise.
   /
  async setVolume(serverId, volume) {
    try {
      const queue = await this.getQueue(serverId);
      await queue.setVolume(volume / 100);
      logger.info(`Set volume to ${volume}% for server ${serverId}`);
    } catch (error) {
      logger.error(`Error setting volume: ${error.message}`);
      throw error;
    }
  }

  /
    Gets the current song in the queue.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<Track>} - The current track object.
   /
  async getCurrentSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);
      return queue.current;
    } catch (error) {
      logger.error(`Error getting current song: ${error.message}`);
      throw error;
    }
  }

  /
    Gets the entire queue list for a server.
   
    @param {string} serverId - The ID of the server.
    @returns {Promise<Track[]>} - An array of track objects.
   /
  async getQueueList(serverId) {
    try {
      const queue = await this.getQueue(serverId);
      return queue.tracks;
    } catch (error) {
      logger.error(`Error getting queue list: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new QueueService();
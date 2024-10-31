const { logger } = require('./logger');
const { Queue } = require('discord-player');

class VoiceHandler {
  constructor(client, player) {
    this.client = client;
    this.player = player;
    this.queues = new Map();
  }

  async joinVoiceChannel(guildId, voiceChannelId) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const voiceChannel = await guild.channels.fetch(voiceChannelId);
      const connection = await voiceChannel.join();
      logger.info(`Joined voice channel ${voiceChannel.name} on server ${guild.name}`);
      return connection;
    } catch (error) {
      logger.error(`Error joining voice channel: ${error.message}`);
      throw error;
    }
  }

  async leaveVoiceChannel(guildId) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const queue = this.queues.get(guildId);
      if (queue) {
        await queue.stop();
      }
      if (guild.me.voice.channel) {
        await guild.me.voice.channel.leave();
      }
      logger.info(`Left voice channel on server ${guild.name}`);
    } catch (error) {
      logger.error(`Error leaving voice channel: ${error.message}`);
      throw error;
    }
  }

  async createQueue(guildId, voiceChannelId) {
    try {
      const queue = await this.player.createQueue(guildId, {
        metadata: {
          channel: voiceChannelId,
        },
      });
      this.queues.set(guildId, queue);
      logger.info(`Created queue for server ${guildId}`);
      return queue;
    } catch (error) {
      logger.error(`Error creating queue: ${error.message}`);
      throw error;
    }
  }

  async getQueue(guildId) {
    try {
      const queue = this.queues.get(guildId);
      if (!queue) {
        throw new Error(`Queue not found for server ${guildId}`);
      }
      return queue;
    } catch (error) {
      logger.error(`Error getting queue: ${error.message}`);
      throw error;
    }
  }

  async playQueue(guildId) {
    try {
      const queue = await this.getQueue(guildId);
      if (!queue.playing) {
        await queue.play();
        logger.info(`Playing queue for server ${guildId}`);
      }
    } catch (error) {
      logger.error(`Error playing queue: ${error.message}`);
      throw error;
    }
  }

  async pauseQueue(guildId) {
    try {
      const queue = await this.getQueue(guildId);
      if (!queue.playing) {
        throw new Error('Queue is not playing');
      }
      queue.pause();
      logger.info(`Paused queue for server ${guildId}`);
    } catch (error) {
      logger.error(`Error pausing queue: ${error.message}`);
      throw error;
    }
  }

  async resumeQueue(guildId) {
    try {
      const queue = await this.getQueue(guildId);
      if (queue.playing) {
        throw new Error('Queue is already playing');
      }
      queue.resume();
      logger.info(`Resumed queue for server ${guildId}`);
    } catch (error) {
      logger.error(`Error resuming queue: ${error.message}`);
      throw error;
    }
  }

  async skipQueue(guildId) {
    try {
      const queue = await this.getQueue(guildId);
      if (!queue.playing) {
        throw new Error('Queue is not playing');
      }
      queue.skip();
      logger.info(`Skipped song in queue for server ${guildId}`);
    } catch (error) {
      logger.error(`Error skipping song: ${error.message}`);
      throw error;
    }
  }

  async stopQueue(guildId) {
    try {
      const queue = await this.getQueue(guildId);
      await queue.stop();
      logger.info(`Stopped queue for server ${guildId}`);
    } catch (error) {
      logger.error(`Error stopping queue: ${error.message}`);
      throw error;
    }
  }

  async setVolume(guildId, volume) {
    try {
      const queue = await this.getQueue(guildId);
      queue.setVolume(volume / 100);
      logger.info(`Set volume to ${volume}% for server ${guildId}`);
    } catch (error) {
      logger.error(`Error setting volume: ${error.message}`);
      throw error;
    }
  }
}

module.exports = VoiceHandler;
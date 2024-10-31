const { Queue } = require('discord-player');
const { logger } = require('../utils/logger');

class MusicService {
  constructor(client, player) {
    this.client = client;
    this.player = player;
  }

  async playSong(serverId, songUrl) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      const song = await this.player.search(songUrl, {
        requestedBy: this.client.user,
      }).then((x) => x.tracks[0]);

      if (!song) {
        throw new Error(`No results found for ${songUrl}`);
      }

      queue.add(song);
      logger.info(`Song ${songUrl} added to queue for server ${serverId}`);

      if (!queue.playing) {
        queue.play();
        logger.info(`Playing queue for server ${serverId}`);
      }

      return song;
    } catch (error) {
      logger.error(`Error playing song: ${error.message}`);
      throw error;
    }
  }

  async pauseSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      if (!queue.playing) {
        throw new Error(`No song is currently playing`);
      }

      queue.pause();
      logger.info(`Paused song for server ${serverId}`);
    } catch (error) {
      logger.error(`Error pausing song: ${error.message}`);
      throw error;
    }
  }

  async resumeSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      if (queue.playing) {
        throw new Error(`Song is already playing`);
      }

      queue.resume();
      logger.info(`Resumed song for server ${serverId}`);
    } catch (error) {
      logger.error(`Error resuming song: ${error.message}`);
      throw error;
    }
  }

  async skipSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      if (!queue.playing) {
        throw new Error(`No song is currently playing`);
      }

      queue.skip();
      logger.info(`Skipped song for server ${serverId}`);
    } catch (error) {
      logger.error(`Error skipping song: ${error.message}`);
      throw error;
    }
  }

  async stopMusic(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      queue.stop();
      logger.info(`Stopped music for server ${serverId}`);
    } catch (error) {
      logger.error(`Error stopping music: ${error.message}`);
      throw error;
    }
  }

  async getQueue(serverId) {
    try {
      const queue = await this.player.getQueue(serverId);
      return queue;
    } catch (error) {
      logger.error(`Error getting queue: ${error.message}`);
      throw error;
    }
  }

  async getCurrentlyPlayingSong(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      return queue.current;
    } catch (error) {
      logger.error(`Error getting current song: ${error.message}`);
      throw error;
    }
  }

  async getQueueList(serverId) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      return queue.tracks;
    } catch (error) {
      logger.error(`Error getting queue list: ${error.message}`);
      throw error;
    }
  }

  async setVolume(serverId, volume) {
    try {
      const queue = await this.getQueue(serverId);

      if (!queue) {
        throw new Error(`No queue found for server ${serverId}`);
      }

      queue.setVolume(volume / 100);
      logger.info(`Set volume to ${volume}% for server ${serverId}`);
    } catch (error) {
      logger.error(`Error setting volume: ${error.message}`);
      throw error;
    }
  }
}

module.exports = MusicService;
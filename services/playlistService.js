const { Playlist } = require('../models/playlist');
const { User } = require('../models/user');
const { Server } = require('../models/server');
const { logger } = require('../utils/logger');
const { database } = require('../config/database');

class PlaylistService {
  /
    Creates a new playlist for a user on a specific server.
   
    @param {string} userId - The ID of the user creating the playlist.
    @param {string} serverId - The ID of the server where the playlist is created.
    @param {string} playlistName - The name of the playlist.
    @returns {Promise<Playlist>} - The newly created playlist object.
   /
  async createPlaylist(userId, serverId, playlistName) {
    try {
      // Check if the playlist name already exists for the user on the server
      const existingPlaylist = await Playlist.findOne({
        where: {
          userId,
          serverId,
          name: playlistName,
        },
      });

      if (existingPlaylist) {
        throw new Error(`A playlist with the name ${playlistName} already exists for this server.`);
      }

      // Create the new playlist
      const newPlaylist = await Playlist.create({
        userId,
        serverId,
        name: playlistName,
      });

      logger.info(`Playlist ${playlistName} created by user ${userId} on server ${serverId}`);
      return newPlaylist;
    } catch (error) {
      logger.error(`Error creating playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Adds a song to an existing playlist.
   
    @param {string} playlistId - The ID of the playlist to add the song to.
    @param {string} songUrl - The URL of the song to add.
    @returns {Promise<Playlist>} - The updated playlist object.
   /
  async addSongToPlaylist(playlistId, songUrl) {
    try {
      // Find the playlist
      const playlist = await Playlist.findByPk(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with ID ${playlistId} not found.`);
      }

      // Add the song to the playlist
      await playlist.addSong(songUrl);

      logger.info(`Song ${songUrl} added to playlist ${playlistId}`);
      return playlist;
    } catch (error) {
      logger.error(`Error adding song to playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Removes a song from an existing playlist.
   
    @param {string} playlistId - The ID of the playlist to remove the song from.
    @param {string} songUrl - The URL of the song to remove.
    @returns {Promise<Playlist>} - The updated playlist object.
   /
  async removeSongFromPlaylist(playlistId, songUrl) {
    try {
      // Find the playlist
      const playlist = await Playlist.findByPk(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with ID ${playlistId} not found.`);
      }

      // Remove the song from the playlist
      await playlist.removeSong(songUrl);

      logger.info(`Song ${songUrl} removed from playlist ${playlistId}`);
      return playlist;
    } catch (error) {
      logger.error(`Error removing song from playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Gets a playlist by its ID.
   
    @param {string} playlistId - The ID of the playlist to retrieve.
    @returns {Promise<Playlist>} - The playlist object if found, otherwise null.
   /
  async getPlaylistById(playlistId) {
    try {
      const playlist = await Playlist.findByPk(playlistId);
      return playlist;
    } catch (error) {
      logger.error(`Error getting playlist by ID: ${error.message}`);
      throw error;
    }
  }

  /
    Gets all playlists for a user on a specific server.
   
    @param {string} userId - The ID of the user.
    @param {string} serverId - The ID of the server.
    @returns {Promise<Playlist[]>} - An array of playlist objects.
   /
  async getPlaylistsByUserAndServer(userId, serverId) {
    try {
      const playlists = await Playlist.findAll({
        where: {
          userId,
          serverId,
        },
      });
      return playlists;
    } catch (error) {
      logger.error(`Error getting playlists by user and server: ${error.message}`);
      throw error;
    }
  }

  /
    Updates the name of an existing playlist.
   
    @param {string} playlistId - The ID of the playlist to update.
    @param {string} newName - The new name for the playlist.
    @returns {Promise<Playlist>} - The updated playlist object.
   /
  async updatePlaylistName(playlistId, newName) {
    try {
      // Find the playlist
      const playlist = await Playlist.findByPk(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with ID ${playlistId} not found.`);
      }

      // Update the playlist name
      await playlist.update({ name: newName });

      logger.info(`Playlist ${playlistId} name updated to ${newName}`);
      return playlist;
    } catch (error) {
      logger.error(`Error updating playlist name: ${error.message}`);
      throw error;
    }
  }

  /
    Deletes an existing playlist.
   
    @param {string} playlistId - The ID of the playlist to delete.
    @returns {Promise<void>} - A void promise.
   /
  async deletePlaylist(playlistId) {
    try {
      // Find the playlist
      const playlist = await Playlist.findByPk(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with ID ${playlistId} not found.`);
      }

      // Delete the playlist
      await playlist.destroy();

      logger.info(`Playlist ${playlistId} deleted`);
    } catch (error) {
      logger.error(`Error deleting playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Plays all songs from a playlist in a voice channel.
   
    @param {string} playlistId - The ID of the playlist to play.
    @param {string} serverId - The ID of the server where the playlist is played.
    @param {string} voiceChannelId - The ID of the voice channel to join.
    @returns {Promise<void>} - A void promise.
   /
  async playPlaylist(playlistId, serverId, voiceChannelId) {
    try {
      // Find the playlist
      const playlist = await Playlist.findByPk(playlistId);

      if (!playlist) {
        throw new Error(`Playlist with ID ${playlistId} not found.`);
      }

      // Find the server
      const server = await Server.findByPk(serverId);

      if (!server) {
        throw new Error(`Server with ID ${serverId} not found.`);
      }

      // Get the songs from the playlist
      const songs = await playlist.getSongs();

      // Connect to the voice channel
      // ... (implementation for connecting to the voice channel)

      // Play the songs one by one
      for (const song of songs) {
        // ... (implementation for playing each song in the voice channel)
      }
    } catch (error) {
      logger.error(`Error playing playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Saves a playlist to the database.
   
    @param {Playlist} playlist - The playlist to save.
    @returns {Promise<Playlist>} - The saved playlist object.
   /
  async savePlaylist(playlist) {
    try {
      const savedPlaylist = await playlist.save();
      return savedPlaylist;
    } catch (error) {
      logger.error(`Error saving playlist: ${error.message}`);
      throw error;
    }
  }

  /
    Finds a playlist by name for a user on a server.
   
    @param {string} userId - The ID of the user.
    @param {string} serverId - The ID of the server.
    @param {string} playlistName - The name of the playlist.
    @returns {Promise<Playlist>} - The playlist object if found, otherwise null.
   /
  async findPlaylistByName(userId, serverId, playlistName) {
    try {
      const playlist = await Playlist.findOne({
        where: {
          userId,
          serverId,
          name: playlistName,
        },
      });
      return playlist;
    } catch (error) {
      logger.error(`Error finding playlist by name: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new PlaylistService();
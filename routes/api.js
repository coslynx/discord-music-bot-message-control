const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const { musicService } = require('../services/musicService');
const { queueService } = require('../services/queueService');
const { playlistService } = require('../services/playlistService');
const { discordUtils } = require('../utils/discordUtils');
const { errorHandler } = require('../utils/errorHandler');

// Play a song
router.post('/play/:serverId/:songUrl', async (req, res) => {
  try {
    const { serverId, songUrl } = req.params;
    const song = await musicService.playSong(serverId, songUrl);
    res.status(200).json({ success: true, message: `Song ${songUrl} added to queue.`, song });
  } catch (error) {
    logger.error(`Error playing song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error playing song: ${error.message}` });
  }
});

// Pause the current song
router.post('/pause/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await musicService.pauseSong(serverId);
    res.status(200).json({ success: true, message: `Song paused.` });
  } catch (error) {
    logger.error(`Error pausing song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error pausing song: ${error.message}` });
  }
});

// Resume the current song
router.post('/resume/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await musicService.resumeSong(serverId);
    res.status(200).json({ success: true, message: `Song resumed.` });
  } catch (error) {
    logger.error(`Error resuming song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error resuming song: ${error.message}` });
  }
});

// Skip the current song
router.post('/skip/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await musicService.skipSong(serverId);
    res.status(200).json({ success: true, message: `Song skipped.` });
  } catch (error) {
    logger.error(`Error skipping song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error skipping song: ${error.message}` });
  }
});

// Stop music playback
router.post('/stop/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await musicService.stopMusic(serverId);
    res.status(200).json({ success: true, message: `Music stopped.` });
  } catch (error) {
    logger.error(`Error stopping music: ${error.message}`);
    res.status(500).json({ success: false, message: `Error stopping music: ${error.message}` });
  }
});

// Get currently playing song
router.get('/current/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const currentSong = await musicService.getCurrentlyPlayingSong(serverId);
    res.status(200).json({ success: true, currentSong });
  } catch (error) {
    logger.error(`Error getting current song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting current song: ${error.message}` });
  }
});

// Get song queue
router.get('/queue/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const queueList = await musicService.getQueueList(serverId);
    res.status(200).json({ success: true, queueList });
  } catch (error) {
    logger.error(`Error getting song queue: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting song queue: ${error.message}` });
  }
});

// Set volume
router.post('/volume/:serverId/:volume', async (req, res) => {
  try {
    const { serverId, volume } = req.params;
    await musicService.setVolume(serverId, volume);
    res.status(200).json({ success: true, message: `Volume set to ${volume}%` });
  } catch (error) {
    logger.error(`Error setting volume: ${error.message}`);
    res.status(500).json({ success: false, message: `Error setting volume: ${error.message}` });
  }
});

// Create a new queue
router.post('/queue/:serverId/:voiceChannelId', async (req, res) => {
  try {
    const { serverId, voiceChannelId } = req.params;
    await queueService.createQueue(serverId, voiceChannelId);
    res.status(200).json({ success: true, message: `Queue created.` });
  } catch (error) {
    logger.error(`Error creating queue: ${error.message}`);
    res.status(500).json({ success: false, message: `Error creating queue: ${error.message}` });
  }
});

// Play the queue
router.post('/play-queue/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await queueService.playQueue(serverId);
    res.status(200).json({ success: true, message: `Playing queue.` });
  } catch (error) {
    logger.error(`Error playing queue: ${error.message}`);
    res.status(500).json({ success: false, message: `Error playing queue: ${error.message}` });
  }
});

// Skip the current song in the queue
router.post('/skip-queue/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await queueService.skipSong(serverId);
    res.status(200).json({ success: true, message: `Skipped song in queue.` });
  } catch (error) {
    logger.error(`Error skipping song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error skipping song: ${error.message}` });
  }
});

// Stop the queue
router.post('/stop-queue/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    await queueService.stopQueue(serverId);
    res.status(200).json({ success: true, message: `Stopped queue.` });
  } catch (error) {
    logger.error(`Error stopping queue: ${error.message}`);
    res.status(500).json({ success: false, message: `Error stopping queue: ${error.message}` });
  }
});

// Set volume for the queue
router.post('/set-volume/:serverId/:volume', async (req, res) => {
  try {
    const { serverId, volume } = req.params;
    await queueService.setVolume(serverId, volume);
    res.status(200).json({ success: true, message: `Volume set to ${volume}%` });
  } catch (error) {
    logger.error(`Error setting volume: ${error.message}`);
    res.status(500).json({ success: false, message: `Error setting volume: ${error.message}` });
  }
});

// Get the current song in the queue
router.get('/current-song/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const currentSong = await queueService.getCurrentSong(serverId);
    res.status(200).json({ success: true, currentSong });
  } catch (error) {
    logger.error(`Error getting current song: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting current song: ${error.message}` });
  }
});

// Get the entire queue list for a server
router.get('/queue-list/:serverId', async (req, res) => {
  try {
    const { serverId } = req.params;
    const queueList = await queueService.getQueueList(serverId);
    res.status(200).json({ success: true, queueList });
  } catch (error) {
    logger.error(`Error getting queue list: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting queue list: ${error.message}` });
  }
});

// Create a new playlist
router.post('/playlist/:userId/:serverId/:playlistName', async (req, res) => {
  try {
    const { userId, serverId, playlistName } = req.params;
    const newPlaylist = await playlistService.createPlaylist(userId, serverId, playlistName);
    res.status(200).json({ success: true, message: `Playlist ${playlistName} created.`, newPlaylist });
  } catch (error) {
    logger.error(`Error creating playlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error creating playlist: ${error.message}` });
  }
});

// Add a song to an existing playlist
router.post('/playlist/:playlistId/:songUrl', async (req, res) => {
  try {
    const { playlistId, songUrl } = req.params;
    const updatedPlaylist = await playlistService.addSongToPlaylist(playlistId, songUrl);
    res.status(200).json({ success: true, message: `Song ${songUrl} added to playlist.`, updatedPlaylist });
  } catch (error) {
    logger.error(`Error adding song to playlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error adding song to playlist: ${error.message}` });
  }
});

// Remove a song from an existing playlist
router.delete('/playlist/:playlistId/:songUrl', async (req, res) => {
  try {
    const { playlistId, songUrl } = req.params;
    const updatedPlaylist = await playlistService.removeSongFromPlaylist(playlistId, songUrl);
    res.status(200).json({ success: true, message: `Song ${songUrl} removed from playlist.`, updatedPlaylist });
  } catch (error) {
    logger.error(`Error removing song from playlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error removing song from playlist: ${error.message}` });
  }
});

// Get a playlist by its ID
router.get('/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await playlistService.getPlaylistById(playlistId);
    res.status(200).json({ success: true, playlist });
  } catch (error) {
    logger.error(`Error getting playlist by ID: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting playlist by ID: ${error.message}` });
  }
});

// Get all playlists for a user on a specific server
router.get('/playlists/:userId/:serverId', async (req, res) => {
  try {
    const { userId, serverId } = req.params;
    const playlists = await playlistService.getPlaylistsByUserAndServer(userId, serverId);
    res.status(200).json({ success: true, playlists });
  } catch (error) {
    logger.error(`Error getting playlists by user and server: ${error.message}`);
    res.status(500).json({ success: false, message: `Error getting playlists by user and server: ${error.message}` });
  }
});

// Update the name of an existing playlist
router.put('/playlist/:playlistId/:newName', async (req, res) => {
  try {
    const { playlistId, newName } = req.params;
    const updatedPlaylist = await playlistService.updatePlaylistName(playlistId, newName);
    res.status(200).json({ success: true, message: `Playlist name updated to ${newName}.`, updatedPlaylist });
  } catch (error) {
    logger.error(`Error updating playlist name: ${error.message}`);
    res.status(500).json({ success: false, message: `Error updating playlist name: ${error.message}` });
  }
});

// Delete an existing playlist
router.delete('/playlist/:playlistId', async (req, res) => {
  try {
    const { playlistId } = req.params;
    await playlistService.deletePlaylist(playlistId);
    res.status(200).json({ success: true, message: `Playlist deleted.` });
  } catch (error) {
    logger.error(`Error deleting playlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error deleting playlist: ${error.message}` });
  }
});

// Play a playlist
router.post('/play-playlist/:playlistId/:serverId/:voiceChannelId', async (req, res) => {
  try {
    const { playlistId, serverId, voiceChannelId } = req.params;
    await playlistService.playPlaylist(playlistId, serverId, voiceChannelId);
    res.status(200).json({ success: true, message: `Playing playlist.` });
  } catch (error) {
    logger.error(`Error playing playlist: ${error.message}`);
    res.status(500).json({ success: false, message: `Error playing playlist: ${error.message}` });
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  errorHandler.logError(err, `API Error: ${err.message}`);
  res.status(500).json({ success: false, message: `Internal Server Error` });
});

module.exports = router;
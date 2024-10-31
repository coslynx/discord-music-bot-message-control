const { Sequelize, DataTypes } = require('sequelize');
const { database } = require('../config/database');

const Playlist = database.define('Playlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  serverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Playlist.associate = (models) => {
  Playlist.belongsTo(models.User, { foreignKey: 'userId' });
  Playlist.belongsTo(models.Server, { foreignKey: 'serverId' });
  Playlist.belongsToMany(models.Song, { through: 'PlaylistSong', foreignKey: 'playlistId' });
};

module.exports = Playlist;
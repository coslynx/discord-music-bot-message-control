const { Sequelize, DataTypes } = require('sequelize');
const { database } = require('../config/database');

const Server = database.define('Server', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  guildId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Other server-specific properties...
  // Example:
  // defaultVolume: {
  //   type: DataTypes.INTEGER,
  //   defaultValue: 50,
  // },
});

Server.associate = (models) => {
  Server.hasMany(models.User, { foreignKey: 'serverId' });
  Server.hasMany(models.Playlist, { foreignKey: 'serverId' });
};

module.exports = Server;
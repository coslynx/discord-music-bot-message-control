const { Sequelize, DataTypes } = require('sequelize');
const { database } = require('../config/database');

const User = database.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  // Other user-specific properties...
  // Example:
  // preferredMusicSource: {
  //   type: DataTypes.STRING,
  //   defaultValue: 'youtube',
  // },
});

User.associate = (models) => {
  User.belongsTo(models.Server, { foreignKey: 'serverId' });
  User.hasMany(models.Playlist, { foreignKey: 'userId' });
};

module.exports = User;
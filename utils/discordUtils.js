const { logger } = require('./logger');

const sendErrorMessage = async (message, errorMessage) => {
  try {
    await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(errorMessage)
          .setColor('RED'),
      ],
    });
  } catch (error) {
    logger.error(`Error sending error message: ${error.message}`);
  }
};

const sendSuccessMessage = async (message, successMessage) => {
  try {
    await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setDescription(successMessage)
          .setColor('GREEN'),
      ],
    });
  } catch (error) {
    logger.error(`Error sending success message: ${error.message}`);
  }
};

const formatSongInfo = (song) => {
  return `[${song.title}](${song.url}) - ${song.author}`;
};

module.exports = {
  sendErrorMessage,
  sendSuccessMessage,
  formatSongInfo,
};
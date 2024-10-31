const { MessageEmbed } = require('discord.js');
const { prefix } = require('../../config/config.js');

module.exports = {
  name: 'help',
  aliases: ['h'],
  description: 'Shows all available commands.',
  usage: 'help [command name]',
  run: async (client, message, args) => {
    const commandName = args[0];

    if (!commandName) {
      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Available Commands:')
        .setDescription(
          client.commands.map((cmd) => `\`${prefix}${cmd.name}\` - ${cmd.description}`).join('\n'),
        );
      return message.channel.send({ embeds: [embed] });
    }

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) {
      return message.channel.send({ embeds: [new MessageEmbed().setDescription('That command does not exist.').setColor('RED')] });
    }

    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setTitle(command.name)
      .addField('Description', command.description, true)
      .addField('Usage', `\`${prefix}${command.name} ${command.usage}\``, true)
      .addField('Aliases', command.aliases ? command.aliases.join(', ') : 'None', true);

    return message.channel.send({ embeds: [embed] });
  },
};
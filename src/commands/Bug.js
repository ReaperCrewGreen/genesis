'use strict';

const Command = require('../Command.js');

/**
 * Send a bug report to owner
 */
class BugReport extends Command {
  /**
   * Constructs a callable command
   * @param {Bot} bot The bot object
   */
  constructor(bot) {
    super(bot, 'core.bug', 'bug', 'Send a bug report to the bot owner');
    this.regex = new RegExp(`^${this.bot.escapedPrefix}${this.call}\\s*(.*)?`, 'i');
    this.usages = [
      {
        description: 'Send a bug report to bot owner',
        parameters: ['bug report'],
      },
      {
        description: 'Send a bug report to bot owner with subject, message, and optional screenshot. The `|` are important.',
        parameters: ['subject', 'body', '(optional) screenshot'],
        separator: ' | ',
      },
      {
        description: 'Send a bug report to bot owner with subject, message, and optional screenshot. The `|` are important.',
        parameters: ['subject', 'body', 'attached image'],
        separator: ' | ',
      },
    ];
  }

  /**
   * Run the command
   * @param {Message} message Message with a command to handle, reply to,
   *                          or perform an action based on parameters.
   */
  run(message) {
    const bugReport = message.cleanContent.match(this.regex)[1];
    const params = bugReport.split('|');

    if (this.bot.owner) {
      const embed = {
        author: {
          icon_url: message.author.avatarURL,
          name: `${message.author.username}#${message.author.discriminator}`,
        },
        title: 'Bug Report',
        fields: [],
      };

      if (params.length < 2) {
        embed.fields = [{ name: '_ _', value: bugReport }];
      } else {
        embed.fields[0] = {
          name: params[0].trim(),
          value: params[1].trim(),
        };
        if (params.length > 2) {
          embed.image = {
            url: params[2].trim(),
          };
        } else if (message.attachments.array().length > 0) {
          embed.image = {
            url: message.attachments.array()[0].url,
          };
        }
      }

      this.bot.client.users.get(this.bot.owner)
        .sendEmbed(embed)
        .then(() => message.reply('Bug report sent.'))
        .catch(this.logger.error);
    }
  }
}

module.exports = BugReport;

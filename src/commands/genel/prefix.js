const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ön-ek',
			group: 'genel',
			memberName: 'ön-ek',
			description: 'Ön eki ayarlar veya gösterir.',
			format: '[prefix/"default"/"none"]',
			aliases: ['önek', 'prefix', 'onek', 'on-ek'],
			details: oneLine`
				Eğer ön ek ayarlanmamışsa şuanki ön eki gösterir.
				Eğer ön ek "default" ise botun ön eki varsayılan ön ek olarak değiştirilir.
				Eğer ön ek "none" ise komutlar sadece mention (@Etiket) ile çalıştırılabilir.
				Sadece yöneticiler ön eki değiştirebilir.
			`,
			examples: ['ön-ek', 'ön-ek -', 'ön-ek omg!', 'ön-ek default', 'ön-ek none'],

			args: [
				{
					key: 'prefix',
					prompt: 'What would you like to set the bot\'s prefix to?',
					type: 'string',
					max: 15,
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		// Just output the prefix
		if(!args.prefix) {
			const prefix = msg.guild ? msg.guild.commandPrefix : this.client.commandPrefix;
			return msg.reply(stripIndents`
				${prefix ? `Ön ek \`${prefix}\` olarak ayarlanmış.` : 'Herhangi bir ön ek ayarlanmamış.'}
				To run commands, use ${msg.anyUsage('command')}.
			`);
		}

		// Check the user's permission before changing anything
		if(msg.guild) {
			if(!msg.member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(msg.author)) {
				return msg.reply('Sadece yöneticiler ön eki değiştirebilir.');
			}
		} else if(!this.client.isOwner(msg.author)) {
			return msg.reply('Sadece bot geliştirici(leri) varsayılan ön eki değiştirebilir.');
		}

		// Save the prefix
		const lowercase = args.prefix.toLowerCase();
		const prefix = lowercase === 'none' ? '' : args.prefix;
		let response;
		if(lowercase === 'default') {
			if(msg.guild) msg.guild.commandPrefix = null; else this.client.commandPrefix = null;
			const current = this.client.commandPrefix ? `\`${this.client.commandPrefix}\`` : 'bulunmuyor';
			response = `Ön ek varsayılan olarak ayarlandı. (currently ${current}).`;
		} else {
			if(msg.guild) msg.guild.commandPrefix = prefix; else this.client.commandPrefix = prefix;
			response = prefix ? `Ön ek \`${args.prefix}\` olarak ayarlandı.` : 'Ön ek kaldırıldı.';
		}

		await msg.reply(`${response} To run commands, use ${msg.anyUsage('komut')}.`);
		return null;
	}
};

const { stripIndents, oneLine } = require('common-tags');
const Command = require('../base');
const { disambiguation } = require('../../util');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'yardım',
			group: 'genel',
			memberName: 'yardım',
			aliases: ['commands', 'help', 'y', 'komutlar'],
			description: 'Komut listesini veya seçilen komut hakkında detaylı bilgileri gösterir.',
			details: oneLine`
				Bir komut hakkında bilgi alınabilir veya
				Tüm komutlar listelenebilir.
			`,
			examples: ['yardım', 'yardım prefix'],
			guarded: true,
			args: [
				{
					key: 'komut',
					prompt: 'Hangi komut hakkında bilgi almak istiyorsun?',
					type: 'string',
					default: ''
				}
			]
		});
	}

	async run(msg, args) {
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.komut, false, msg);
		const showAll = args.komut && args.komut.toLowerCase() === 'hepsi';
		if(args.komut && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__**${commands[0].name}** komutu:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Sadece sunucularda kullanılabilir)' : ''}
						${commands[0].nsfw ? ' (NSFW içerikli)' : ''}
					`}

					**Kullanım:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Alternatifler:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Kategori:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Detaylar:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Örnekler:**\n${commands[0].examples.map(s => `\`${s}\``).join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('DM yoluyla mesajları gönderdim.'));
				} catch(err) {
					messages.push(await msg.reply('Sana DM yoluyla mesaj gönderemiyorum. Muhtemelen DM\'lerini kapatmışsın.'));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Birden fazla komut bulundu. Lütfen daha seçici ol');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Bu komutu tanıyamadım. ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} kullanarak tüm komutları görüntüleyebilirsin.`
				);
			}
		} else {
			const messages = [];
			try {
				messages.push(await msg.direct(stripIndents`
					${oneLine`
						Bir komut kullanmak için ${msg.guild ? `${msg.guild.name} adlı sunucuda` : 'DM\'lerde'}
						${Command.usage('komut', msg.guild ? msg.guild.commandPrefix : null, this.client.user)} yazmalısın.
						Örnek olarak, ${Command.usage('yardım', msg.guild ? msg.guild.commandPrefix : null, this.client.user)} yazabilirsin.
					`}
					Ayrıca bir komut kullanmak için DM'lerde sadece ${Command.usage('komut', null, null)} kullanabilirsin.

					${this.usage('<komut>', null, null)} kullanarak seçilen komut hakkında bilgi alabilirsin.
					${this.usage('hepsi', null, null)} kullanarak *bütün* komutları görüntüleyebilirsin, sadece kullanabilir olanları değil.

					__**${showAll ? 'Bütün komutlar' : `${msg.guild ? `${msg.guild} adlı sunucuda` : 'DM\'lerde kullanılabilen komutlar'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
						.map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg)))
								.map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW içerikli)' : ''}`).join('\n')
							}
						`).join('\n\n')
					}
				`, { split: true }));
				if(msg.channel.type !== 'dm') messages.push(await msg.reply('DM yoluyla mesajları gönderdim.'));
			} catch(err) {
				messages.push(await msg.reply('Sana DM yoluyla mesaj gönderemiyorum. Muhtemelen DM\'lerini kapatmışsın.'));
			}
			return messages;
		}
	}
};

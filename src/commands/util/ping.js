const { oneLine } = require('common-tags');
const Command = require('../base');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'gecikme',
			group: 'genel',
			memberName: 'gecikme',
			aliases: ['gecikmeler', 'pings', 'ping'],
			description: 'Bot ile Discord sunucusu arasındaki gecikme süresini gösterir.',
			throttling: {
				usages: 5,
				duration: 10
			}
		});
	}

	async run(msg) {
		if(!msg.editable) {
			const pingMsg = await msg.reply('Gecikme süresi hesaplanıyor...');
			return pingMsg.edit(oneLine`
				${msg.channel.type !== 'dm' ? `${msg.author},` : ''}
				Pong! Mesaj gidiş-dönüşü ${pingMsg.createdTimestamp - msg.createdTimestamp}ms sürdü.
				${this.client.ping ? `Genel gecikme süresi ise ${Math.round(this.client.ping)}ms.` : ''}
			`);
		} else {
			await msg.edit('Gecikme süresi hesaplanıyor...');
			return msg.edit(oneLine`
				Pong! Mesaj gidiş-dönüşü ${pingMsg.createdTimestamp - msg.createdTimestamp}ms sürdü.
				${this.client.ping ? `Genel gecikme süresi ise ${Math.round(this.client.ping)}ms.` : ''}
			`);
		}
	}
};

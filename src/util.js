function disambiguation(items, label, property = 'name') {
	const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
	return `Multiple ${label} found, please be more specific: ${itemList}`;
}

function paginate(items, page = 1, pageLength = 10) {
	const maxPage = Math.ceil(items.length / pageLength);
	if(page < 1) page = 1;
	if(page > maxPage) page = maxPage;
	const startIndex = (page - 1) * pageLength;
	return {
		items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
		page,
		maxPage,
		pageLength
	};
}

const permissions = {
	ADMINISTRATOR: 'Yönetici',
	VIEW_AUDIT_LOG: 'Denetim kaydını görüntüle',
	MANAGE_GUILD: 'Sunucuyu yönet',
	MANAGE_ROLES: 'Rolleri yönet',
	MANAGE_CHANNELS: 'Kanalları yönet',
	KICK_MEMBERS: 'Üyeleri at',
	BAN_MEMBERS: 'Üyeleri yasakla',
	CREATE_INSTANT_INVITE: 'Anlık davet oluştur',
	CHANGE_NICKNAME: 'Kullanıcı adını değiştir',
	MANAGE_NICKNAMES: 'Kullanıcı adlarını yönet',
	MANAGE_EMOJIS: 'Emojileri yönet',
	MANAGE_WEBHOOKS: 'Webhook\'ları yönet',
	VIEW_CHANNEL: 'Metin/Ses kanallarını görüntüle',
	SEND_MESSAGES: 'Mesaj gönder',
	SEND_TTS_MESSAGES: 'TTS mesaj gönder',
	MANAGE_MESSAGES: 'Mesajları yönet',
	EMBED_LINKS: 'Embed gönder',
	ATTACH_FILES: 'Dosya gönder',
	READ_MESSAGE_HISTORY: 'Mesaj geçmnişini oku',
	MENTION_EVERYONE: 'Herkesten bahset',
	USE_EXTERNAL_EMOJIS: 'Harici emojileri kullan',
	ADD_REACTIONS: 'Tepki ekle',
	CONNECT: 'Bağlan',
	SPEAK: 'Konuş',
	MUTE_MEMBERS: 'Üyeleri sustur',
	DEAFEN_MEMBERS: 'Üyeleri sağırlaştır',
	MOVE_MEMBERS: 'Üyeleri taşı',
	USE_VAD: 'Ses aktivetisini kullan'
};

module.exports = {
	disambiguation,
	paginate,
	permissions
};

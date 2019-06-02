export interface DiscordWebHook {
	name: string;
	url: string;
	channel_id: string;
	token: string;
	avatar?: string;
	guild_id: string;
	id: string;
}

export interface DiscordToken {
	access_token: string;
	webhook: DiscordWebHook;
	expires_in: number;
	token_type: string;
	scope: string;
	refresh_token: string;
}

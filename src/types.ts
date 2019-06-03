export interface ZeitWebHook {
	createdAt: number;
    events: string[];
	id: string;
	name: string;
	ownerId: string;
	url: string;
}

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

export interface IntegrationConfig {
	ownerId: string;
	userId: string;
	teamId?: string;
	zeitToken: string;
	webhooks: {
		configurationId: string,
		discordWebhook: DiscordWebHook,
		zeitWebhook: ZeitWebHook
	}[];
}

export interface Event {
	userId?: string;
	teamId?: string;
	type?: string;
	region?: string;
	payload?: {
		name: string;
		project: string;
		url: string;
		deploymentId: string;
		plan: string;
		type: string;
	};
}
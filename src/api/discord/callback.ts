import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { send } from 'micro';
import { AUTH_COOKIE_NAME } from '../../constants';
import { DiscordToken } from '../../types';
import createZeitWebhook from '../../lib/zeit/create-zeit-webhook';
import getDiscordAccessToken from '../../lib/discord/get-discord-access-token';
import sendDiscordMessage from '../../lib/discord/send-discord-message'
import cookie from 'cookie';
import db from '../../lib/postgres/queries';

interface CallbackQuery {
	code?: string;
    state?: string;
    guild_id?: string;
    permissions?: string;
}


export default async function callback(req: IncomingMessage, res: ServerResponse) {
    const { query } = parse(req.url!, true);
    const { code, state }: CallbackQuery = query;
    const cookies = cookie.parse(req.headers.cookie || '');
	const context = JSON.parse(cookies[AUTH_COOKIE_NAME] || '{}');

	if (!code || !state) {
		return send(res, 403, 'No code or state found');
	}

	if (state !== context.state) {
		return send(res, 403, 'Invalid state');
	}

	if (!context.ownerId) {
		return send(res, 403, 'No ownerId found to create ZEIT webhook');
	}

	if (!context.token) {
		return send(res, 403, 'No code found to create ZEIT webhook');
	}

	if (!context.configurationId) {
		return send(
			res,
			403,
			'No configurationId found to create ZEIT webhook'
		);
	}
	console.log("DISCORD_CODE", code)
	const discordWebHook:DiscordToken = await getDiscordAccessToken(code);
	console.log("DISCORD_TOKEN", discordWebHook)
	const zeitWebhook = await createZeitWebhook(context.token)
	console.log("ZEIT_WEBHOOK", zeitWebhook)

	// const newEntry = {
	// 	owner_id: context.ownerId,
    //     zeit_token: context.token,
    //     webhook_token: discordWebHook.webhook.token,
    //     webhook_id: discordWebHook.webhook.id,
    //     guild_id: discordWebHook.webhook.guild_id,
	// 	channel_id: discordWebHook.webhook.channel_id
	// }

	await db.connect()
	const createWebHook = await db.query(`
		INSERT INTO 
		webhooks(owner_id, zeit_token, webhook_token, webhook_id, guild_id, channel_id)
		VALUES($1, $2, $3, $4, $5, $6)
	`, [ 
		context.ownerId,
		context.token,
		discordWebHook.webhook.token,
		discordWebHook.webhook.id,
		discordWebHook.webhook.guild_id,
		discordWebHook.webhook.channel_id
	]);
	await db.end();

	console.log("INSERT RESPONSE", createWebHook)

	

	await sendDiscordMessage({dwt: discordWebHook, event: "Test message."})

    res.writeHead(302, {
		Location: `${decodeURIComponent(context.next)}`,
		'Set-Cookie': cookie.serialize(AUTH_COOKIE_NAME, '', { path: '/' })
	});

	res.end('Redirecting...');
	return null;
}
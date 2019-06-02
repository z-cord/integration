import fetch from 'node-fetch';
import { DiscordToken } from '../../types';

/**

 */
export default async function sendDiscordMessage({
	dwt, 
	event
}:{
	dwt: DiscordToken,
	event: string
}){
	const url = `https://discordapp.com/api/v6/webhooks/${dwt.webhook.id}/${dwt.webhook.token}` 
	await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			"content": event
		}),
		headers: {
			"Content-Type": "application/json",
		}
	});
}

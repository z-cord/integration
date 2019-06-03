import fetch from 'node-fetch';
import { DiscordWebHook, Event } from '../../types';

/**

 */
export default async function sendDiscordMessage({
	webhook, 
	event
}:{
	webhook: DiscordWebHook,
	event: Event
}){
	const url = `https://discordapp.com/api/v6/webhooks/${webhook.id}/${webhook.token}` 

	await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			"content": `User reynaldo has triggered a deploy for ${event.payload!.project}`,
			"embeds": [
				{
					type: "rich",
					title: `Deployment link for: ${event.payload!.name.toUpperCase()}`,
					url: `https://${event.payload!.url}`,
					description: 
`Event: ${event.type!.toUpperCase()}
Name: ${event.payload!.name.toUpperCase()}
Project: ${event.payload!.project.toUpperCase()}
Plan: ${event.payload!.plan.toUpperCase()}
Type: ${event.payload!.type.toUpperCase()}
Region: ${event.region!.toUpperCase()}
URL: https://${event.payload!.url}`
				}
			]
		}),
		headers: {
			"Content-Type": "application/json",
		}
	});
}

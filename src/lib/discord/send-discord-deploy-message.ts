import fetch from 'node-fetch';
import { Event, IntegrationConfig } from '../../types';
import getUserInfo from '../zeit/get-user-info';
import { User } from '../zeit/types';

/**

 */
export default async function sendDiscordDeployMessage({
	config, 
	event
}:{
	config: IntegrationConfig,
	event: Event
}){

	const userInfo:User = await getUserInfo(config.zeitToken)
	// for now its default to first webhook till we sort by configuration id
	const webhook = config.webhooks[0].discordWebhook;

	const url = `https://discordapp.com/api/v6/webhooks/${webhook.id}/${webhook.token}` 
	await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			"content": `User ${userInfo.user.username} has triggered a deploy for ${event.payload!.project}`,
			"embeds": [
				{
					type: "rich",
					title: `Deployment link for: ${event.payload!.name.toUpperCase()}`,
					url: `https://${event.payload!.url}`,
					description: 
`
EVENT: 		${event.type}
NAME: 		${event.payload.name}
PROJECT: 	${event.payload.project}
PLAN: 		${event.payload.plan}
TYPE: 		${event.payload.type}
REGION: 	${event.region}
URL: 		https://${event.payload.url}
`
				}
			]
		}),
		headers: {
			"Content-Type": "application/json",
		}
	});
}

import { IncomingMessage, ServerResponse } from 'http';
import { send, json } from 'micro';
import getIntegrationConfig from '../lib/mongodb/get-integration-config';
import { IntegrationConfig, Event } from '../types';
import sendDiscordMessage from '../lib/discord/send-discord-message';

export default async function webhookHandler(
	req: IncomingMessage,
	res: ServerResponse
) {
	const event:Event = await json(req);
	console.log('WEBHOOK REQ', event);

	const ownerId = event.userId || event.teamId;
	const config:IntegrationConfig = await getIntegrationConfig(ownerId!);

	if (event.type == "deployment") {
		sendDiscordMessage({webhook: config.webhooks[0].discordWebhook, event})
	}
    return send(res, 200);
}
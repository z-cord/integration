import { IncomingMessage, ServerResponse } from 'http';
import { send, json } from 'micro';
import getIntegrationConfig from '../lib/mongodb/get-integration-config';
import { IntegrationConfig } from '../types';
import sendDiscordDeployMessage from '../lib/discord/send-discord-deploy-message';

export default async function webhookHandler(
	req: IncomingMessage,
	res: ServerResponse
) {
	const event:any = await json(req);
	console.log('WEBHOOK REQ', event);

	const ownerId = event.userId || event.teamId;
	const config:IntegrationConfig = await getIntegrationConfig(ownerId!);

	if (event.type == "deployment") {
		sendDiscordDeployMessage({config, event})
	}
    return send(res, 200);
}
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { send, json } from 'micro';
// import getIntegrationConfig from '../lib/mongodb/get-integration-config';

interface WebhookParams {
	incoming_webhook?: string;
	owner_id?: string;
}

export default async function webhookHandler(
	req: IncomingMessage,
	res: ServerResponse
) {
	const { query }: { query: WebhookParams } = parse(req.url!, true);
	const event = await json(req);
	console.log('WEBHOOK REQ', event);
	console.log(query);

	// const incomingWebhook = decodeURIComponent(query.incoming_webhook!);
	// const config = await getIntegrationConfig(query.owner_id!);

	

    return send(res, 200);
}


// { 
// 	type: 'deployment',
// 	createdAt: 1559521465134,
// 	payload: 
// 		{ deploymentId: 'dpl_HwwvK8E9huppPtvCbWnsfYjTSKES',
// 		name: 'discord-integration',
// 		project: 'discord-integration',
// 		url: 'discord-integration-p1vm38gp4.now.sh',
// 		plan: 'unlimited',
// 		regions: [ 'iad1' ],
// 		type: 'LAMBDAS',
// 		deployment: 
// 		{ id: 'dpl_HwwvK8E9huppPtvCbWnsfYjTSKES',
// 			name: 'discord-integration',
// 			url: 'discord-integration-p1vm38gp4.now.sh',
// 			meta: {} } },
// 	region: 'now-bru',
// 	teamId: null,
// 	userId: 'Zbb3hO86zXAnQiZWJ8w7p3Dm' 
// }
import { parse } from 'url';
import { send, json } from 'micro';
import { IncomingMessage, ServerResponse } from 'http';
import getAccessToken from '../../lib/zeit/get-zeit-access-token';
import getAuthorizeUrl from '../../lib/get-authorize-url';
import maybeGetIntegrationConfig from '../../lib/mongodb/maybe-get-integration-config';
import saveIntegrationConfig from '../../lib/mongodb/save-integration-config';
import getIntegrationConfig from '../../lib/mongodb/get-integration-config';
import removeIntegrationConfig from '../../lib/mongodb/remove-integration-config';
import deleteZeitWebhook from '../../lib/zeit/delete-zeit-webhook'


interface CallbackQuery {
	code?: string;
	next?: string;
}

interface DeletePayload {
	configurationId?: string;
	userId?: string;
	teamId?: string;
}

/**
 * Handles the callback to exchange a ZEIT authorization code for a token.
 * With the token it brings the information related to the owner and the
 * installation. We will store it as the basic config for an integration
 * user.
 *
 * When called with DELETE it removes an installation webhook and maybe
 * it will remove the configuration entirely.
 */
export default async function zeitCallback(
	req: IncomingMessage,
	res: ServerResponse
) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Authorization, Accept, Content-Type'
	);

	if (req.method === 'OPTIONS') {
		return send(res, 200);
	}

	if (req.method === 'DELETE') {
		const data: DeletePayload = await json(req);
		const configurationId = data.configurationId;
		const config = await getIntegrationConfig(data.teamId || data.userId!);
		const deletedIdx = config.webhooks.findIndex(
			webhook => webhook.configurationId === configurationId
		);

		if (deletedIdx !== -1) {
			const webhook = config.webhooks[deletedIdx];
			await deleteZeitWebhook(config.zeitToken, webhook.zeitWebhook.id);

			if (config.webhooks.length <= 1) {
				await removeIntegrationConfig(config);
			} else {
				config.webhooks = [
					...config.webhooks.slice(0, deletedIdx),
					...config.webhooks.slice(deletedIdx + 1)
				];
				await saveIntegrationConfig(config);
			}
		}

		return send(res, 204);
	}

	/**
	 * When there is a GET in this endpoint it means there is an authorization
	 * code to exchange for a token so we ensure that the data comes in the
	 * querystring and finish the token issuance.
	 */
	if (req.method === 'GET') {
		const { query }: { query: CallbackQuery } = parse(req.url!, true);
        const { code, next } = query;
		const tokenInfo = await getAccessToken(code!);

		if (!tokenInfo) {
			return send(res, 403, 'Error exchanging OAuth code');
		}

		if (!code || !next) {
			return send(res, 403, 'No code or next url found in query');
		}

		const ownerId = tokenInfo.team_id || tokenInfo.user_id;
		const configurationId = tokenInfo.installation_id;
		const maybeConfig = await maybeGetIntegrationConfig(ownerId);

		await saveIntegrationConfig({
			zeitToken: tokenInfo.access_token,
			// teamId: tokenInfo.team_id,
			userId: tokenInfo.user_id,
			webhooks: maybeConfig ? maybeConfig.webhooks : [],
			ownerId
		});

		res.writeHead(302, {
			Location: getAuthorizeUrl({ next, ownerId, configurationId, token: tokenInfo.access_token })
		});
		res.end('Redirecting...');
		return null;
	}

	return send(res, 404, {
		error: {
			message: 'not_found'
		}
	});
}

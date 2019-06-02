import { parse } from 'url';
import { send, json } from 'micro';
import { IncomingMessage, ServerResponse } from 'http';
import getAccessToken from '../../lib/zeit/get-zeit-access-token';
import getAuthorizeUrl from '../../lib/get-authorize-url';


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

	// if (req.method === 'DELETE') {
	// 	const data: DeletePayload = await json(req);
	// 	const configurationId = data.configurationId;
	// }

	/**
	 * When there is a GET in this endpoint it means there is an authorization
	 * code to exchange for a token so we ensure that the data comes in the
	 * querystring and finish the token issuance.
	 */
	if (req.method === 'GET') {
		const { query }: { query: CallbackQuery } = parse(req.url!, true);
        const { code, next } = query;
		const tokenInfo = await getAccessToken(code!);
		console.log("TOKEN_INFO", tokenInfo);

		if (!tokenInfo) {
			return send(res, 403, 'Error exchanging OAuth code');
		}

		if (!code || !next) {
			return send(res, 403, 'No code or next url found in query');
		}

		const ownerId = tokenInfo.team_id || tokenInfo.user_id;
		const configurationId = tokenInfo.installation_id;

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

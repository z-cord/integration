import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { send } from 'micro';
import cookie from 'cookie';
import { AUTH_COOKIE_NAME } from '../../constants';
import getDiscordAuthorizeUrl from '../../lib/discord/get-discord-auth-url'

interface AuthorizeQuery {
	configurationId?: string;
	next?: string;
	ownerId?: string;
	scope?: string;
	token?: string;
}

/**
 * Handles a Discord authorization request generating a state and writing
 * context information to a cookie to later redirect to the Discord
 * authorization URL to complete the flow.
 */
export default function authorize(req: IncomingMessage, res: ServerResponse) {
    const { query }: { query: AuthorizeQuery } = parse(req.url!, true);
	if (!query.next) {
		return send(res, 403, 'A query parameter `next` is required');
	}

	if (!query.ownerId) {
		return send(res, 403, 'A query parameter `ownerId` is required');
	}

	if (!query.token) {
		return send(res, 403, 'A query parameter `token` is required');
	}

	if (!query.configurationId) {
		return send(
			res,
			403,
			'A query parameter `configurationId` is required'
		);
	}

	const state = `state_${Math.random()}`;
	const redirectUrl = getDiscordAuthorizeUrl(state);
    
	const context = {
		next: query.next,
		ownerId: query.ownerId,
		configurationId: query.configurationId,
		scope: query.scope,
		token: query.token,
		state
	};

  // 302 Redirect Status Code, Redirecting to redirectURL
	res.writeHead(302, {
		Location: redirectUrl,
		'Set-Cookie': cookie.serialize(
			AUTH_COOKIE_NAME,
			JSON.stringify(context),
			{ path: '/' }
		)
	});

	res.end('Redirecting...');
}
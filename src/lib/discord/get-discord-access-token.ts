import fetch from 'node-fetch';
import { stringify } from 'querystring';
import { DiscordToken } from '../../types';


/**
 * Allows to exchange a Discord authorization code for an actual token. It is
 * assumed that the token has the scope of incoming webhook as that's the
 * only feature we include for now.
 */
export default async function getAccessToken(code: string) {
	const response = await fetch('https://discordapp.com/api/v6/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		body: stringify({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
            code,
            redirect_uri: `${process.env.HOOK_URL}/callback`,
            scope: "webhook.incoming bot",
            grant_type: "authorization_code"
		})
	});

	if (response.status !== 200) {
		throw new Error(
			`Error retrieving discord token: ${
				response
			} error: ${await response.text()}`
		);
	}

	const tokenInfo: DiscordToken = await response.json();
	return tokenInfo;
}

import fetch from 'node-fetch';
import { stringify } from 'querystring';

interface DiscordTokenInfo {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string
    scope: string;
}

export default async function refreshAccessToken(refresh_token: string) {
	const response = await fetch('https://discordapp.com/api/v6/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json'
		},
		body: stringify({
			client_id: process.env.DISCORD_CLIENT_ID,
			client_secret: process.env.DISCORD_CLIENT_SECRET,
            refresh_token,
            scope: "identify bot",
            grant_type: "refresh_token"
		})
	});

	if (response.status !== 200) {
		throw new Error(
			`Invalid status code on Azure token fetching: ${
				response.status
			} error: ${await response.text()}`
		);
	}

	const tokenInfo: DiscordTokenInfo = await response.json();
	return tokenInfo;
}

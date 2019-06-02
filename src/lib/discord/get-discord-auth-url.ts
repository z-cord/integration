import { stringify } from 'querystring';

const { DISCORD_CLIENT_ID } = process.env;
// https://discordapp.com/oauth2/authorize?&client_id=584392282502070293&scope=bot&permissions=8

/**
 * Allows to get a formatted authorization URL to authenticate with OAuth
 * in Discord so we can show the user the authorization screen that later
 * redirects to the callback URL.
 */
export default function getDiscordAuthorizeUrl(state: string) {
	return `https://discordapp.com/oauth2/authorize?${stringify({
		client_id: DISCORD_CLIENT_ID,
		state,
		permissions: 536881216,
		redirect_uri: `${process.env.HOOK_URL}/callback`,
		scope:"identify bot webhook.incoming",
		response_type: "code"
	})}`;
}

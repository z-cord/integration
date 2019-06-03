import fetch from 'node-fetch';

/**

 */
export default async function createZeitWebhook(token:String) {
	const res = await fetch("https://api.zeit.co/www/user", {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

	if (res.status !== 200) {
		throw new Error(
			`Error getting user info: ${
				res
			} error: ${await res.text()}`
		);
	}
	const json = await res.json();
	if (json.error) {
		return null;
    }
	return json;
}

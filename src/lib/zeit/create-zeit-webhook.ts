import fetch from 'node-fetch';

/**

 */
export default async function createZeitWebhook(token:String){
	const res = await fetch("https://api.zeit.co/v1/integrations/webhooks", {
        body: JSON.stringify({
            url: `${process.env.HOOK_URL}/webhook`,
            name: "Created to tunnel events to Discord webhook"
        }),
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (res.status !== 200) {
		throw new Error(
			`Error creating ZEIT webhook: ${
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
